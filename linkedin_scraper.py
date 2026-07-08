"""
LinkedIn Public Jobs Scraper → Karirak CSV Template
=====================================================
Scrapes LinkedIn public job listings (no login required) and
outputs a CSV matching the Karirak bulk-import template format.

Usage:
    python linkedin_scraper.py --query "developer" --location "Egypt" --pages 3
    python linkedin_scraper.py --query "marketing" --location "Saudi Arabia" --pages 5 --output my_jobs.csv

Requirements:
    pip install requests beautifulsoup4 lxml

Notes:
    - Only scrapes PUBLIC LinkedIn job listings (no account needed)
    - Adds random delays to avoid rate limiting
    - If blocked, try --delay 5 or use a VPN
"""

import argparse
import csv
import time
import random
import re
import sys
from datetime import datetime
from urllib.parse import urlencode, quote_plus

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing dependencies. Run: pip install requests beautifulsoup4 lxml")
    sys.exit(1)


# ── Config ────────────────────────────────────────────────────────────────────

CSV_COLUMNS = [
    "title", "description", "salary", "type",
    "company", "category", "country", "applyLink", "location", "status"
]

# Map common LinkedIn job titles/keywords → Karirak category slugs
CATEGORY_MAP = {
    "frontend": "web-development",
    "backend": "web-development",
    "fullstack": "web-development",
    "full stack": "web-development",
    "web developer": "web-development",
    "wordpress": "wordpress-design",
    "android": "android-development",
    "ios": "ios-development",
    "mobile": "android-development",
    "network": "computer-networking",
    "cybersecurity": "cybersecurity",
    "security": "cybersecurity",
    "devops": "computer-networking",
    "cloud": "computer-networking",
    "data analyst": "business-analytics",
    "data scientist": "business-analytics",
    "business analyst": "business-analytics",
    "marketing": "digital-marketing",
    "seo": "search-engine-optimization-seo",
    "social media": "social-media-marketing",
    "content": "copywriting",
    "copywriter": "copywriting",
    "graphic": "graphic-design",
    "ui/ux": "user-experience-design",
    "ux": "user-experience-design",
    "design": "graphic-design",
    "accountant": "accounting",
    "accounting": "accounting",
    "finance": "financial-analysis",
    "financial": "financial-analysis",
    "hr": "human-resources",
    "human resources": "human-resources",
    "recruiter": "human-resources",
    "project manager": "project-management",
    "project management": "project-management",
    "legal": "corporate-law",
    "lawyer": "corporate-law",
    "support": "technical-support",
    "customer service": "technical-support",
    "technical support": "technical-support",
    "translator": "translation",
    "translation": "translation",
    "writer": "writing",
    "writing": "writing",
    "event": "event-planning",
    "photography": "event-photography",
    "insurance": "insurance",
    "healthcare": "healthcare-consulting",
    "consulting": "consulting",
    "sales": "lead-generation",
}

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }


def guess_category(title: str) -> str:
    title_lower = title.lower()
    for keyword, slug in CATEGORY_MAP.items():
        if keyword in title_lower:
            return slug
    return "consulting"  # default fallback


def guess_job_type(text: str) -> str:
    text_lower = text.lower()
    if "part-time" in text_lower or "part time" in text_lower:
        return "part-time"
    if "contract" in text_lower or "freelance" in text_lower:
        return "contract"
    if "internship" in text_lower or "intern" in text_lower:
        return "internship"
    if "remote" in text_lower:
        return "remote"
    if "hybrid" in text_lower:
        return "hybrid"
    return "full-time"


def clean_text(text: str) -> str:
    """Remove excessive whitespace and newlines."""
    return re.sub(r"\s+", " ", text).strip()


def extract_country(location: str) -> str:
    """Try to extract the country from a location string like 'Cairo, Egypt'."""
    if not location:
        return "Unknown"
    parts = [p.strip() for p in location.split(",")]
    # Last part is usually the country
    return parts[-1] if len(parts) > 1 else location


# ── Scraping ──────────────────────────────────────────────────────────────────

def fetch_job_list(query: str, location: str, start: int = 0) -> BeautifulSoup | None:
    """Fetch a page of LinkedIn public job listings."""
    params = {
        "keywords": query,
        "location": location,
        "start": start,
        "position": 1,
        "pageNum": 0,
    }
    url = f"https://www.linkedin.com/jobs/search/?{urlencode(params)}"
    print(f"  Fetching: {url}")

    try:
        resp = requests.get(url, headers=get_headers(), timeout=15)
        if resp.status_code == 429:
            print("  ⚠ Rate limited (429). Waiting 30s...")
            time.sleep(30)
            return None
        if resp.status_code != 200:
            print(f"  ✗ HTTP {resp.status_code}")
            return None
        return BeautifulSoup(resp.text, "lxml")
    except requests.RequestException as e:
        print(f"  ✗ Request error: {e}")
        return None


def fetch_job_detail(job_url: str) -> dict:
    """Fetch individual job page to get full description."""
    try:
        time.sleep(random.uniform(1.5, 3.5))
        resp = requests.get(job_url, headers=get_headers(), timeout=15)
        if resp.status_code != 200:
            return {}
        soup = BeautifulSoup(resp.text, "lxml")

        # Description
        desc_el = soup.select_one(".description__text, .show-more-less-html__markup")
        description = clean_text(desc_el.get_text()) if desc_el else ""

        # Criteria (employment type, seniority, etc.)
        criteria = {}
        for item in soup.select(".description__job-criteria-item"):
            label_el = item.select_one(".description__job-criteria-subheader")
            value_el = item.select_one(".description__job-criteria-text")
            if label_el and value_el:
                criteria[clean_text(label_el.get_text()).lower()] = clean_text(value_el.get_text())

        employment_type = criteria.get("employment type", "")

        return {"description": description, "employment_type": employment_type}
    except Exception:
        return {}


def scrape_jobs(query: str, location: str, pages: int, delay: float, skip_detail: bool) -> list[dict]:
    jobs = []
    per_page = 25  # LinkedIn shows 25 jobs per page

    for page in range(pages):
        start = page * per_page
        print(f"\n[Page {page + 1}/{pages}] (offset {start})...")

        soup = fetch_job_list(query, location, start)
        if not soup:
            continue

        cards = soup.select(".job-search-card, .base-card")
        if not cards:
            # Try alternative selectors
            cards = soup.select("[data-entity-urn]")

        if not cards:
            print("  [!] No job cards found on this page. LinkedIn may be blocking.")
            break

        print(f"  Found {len(cards)} job cards")

        for card in cards:
            try:
                # Title
                title_el = card.select_one(".base-search-card__title, h3.base-search-card__title")
                title = clean_text(title_el.get_text()) if title_el else "Unknown"

                # Company
                company_el = card.select_one(".base-search-card__subtitle, h4.base-search-card__subtitle")
                company = clean_text(company_el.get_text()) if company_el else "Unknown"

                # Location
                loc_el = card.select_one(".job-search-card__location, .base-search-card__metadata span")
                location_str = clean_text(loc_el.get_text()) if loc_el else location

                # Apply link
                link_el = card.select_one("a.base-card__full-link, a[href*='/jobs/view/']")
                apply_link = link_el["href"].split("?")[0] if link_el and link_el.get("href") else ""

                # Get detail page (description + type)
                description = f"Join {company} as a {title}. This role requires relevant experience and skills in the field."
                employment_type = ""

                if apply_link and not skip_detail:
                    detail = fetch_job_detail(apply_link)
                    if detail.get("description"):
                        description = detail["description"][:800]  # cap at 800 chars
                    employment_type = detail.get("employment_type", "")

                # Map to Karirak schema
                country = extract_country(location_str)
                job_type = guess_job_type(f"{title} {employment_type}")
                category = guess_category(title)

                jobs.append({
                    "title": title,
                    "description": description,
                    "salary": "Competitive",  # LinkedIn rarely shows salary publicly
                    "type": job_type,
                    "company": company,
                    "category": category,
                    "country": country,
                    "applyLink": apply_link,
                    "location": location_str,
                    "status": "active",
                })

                print(f"  [OK] {title} @ {company} ({country})")

            except Exception as e:
                print(f"  [ERR] Error parsing card: {e}")
                continue

        # Delay between pages
        wait = delay + random.uniform(1, 3)
        print(f"  Waiting {wait:.1f}s before next page...")
        time.sleep(wait)

    return jobs


# ── CSV Export ────────────────────────────────────────────────────────────────

def save_csv(jobs: list[dict], output_path: str):
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(jobs)
    print(f"\n[DONE] Saved {len(jobs)} jobs to: {output_path}")


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Scrape LinkedIn public jobs -> Karirak CSV template"
    )
    parser.add_argument("--query", "-q", required=True, help='Job search query e.g. "developer"')
    parser.add_argument("--location", "-l", default="", help='Location e.g. "Egypt" or "Saudi Arabia"')
    parser.add_argument("--pages", "-p", type=int, default=2, help="Number of pages to scrape (default: 2, max: 10)")
    parser.add_argument("--delay", "-d", type=float, default=3.0, help="Base delay between pages in seconds (default: 3)")
    parser.add_argument("--output", "-o", default="", help="Output CSV filename (default: auto-generated)")
    parser.add_argument("--skip-detail", action="store_true", help="Skip fetching individual job pages (faster but no description)")

    args = parser.parse_args()

    pages = min(args.pages, 10)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output = args.output or f"linkedin_jobs_{args.query.replace(' ', '_')}_{timestamp}.csv"

    print("=" * 60)
    print("  LinkedIn -> Karirak Job Scraper")
    print("=" * 60)
    print(f"  Query    : {args.query}")
    print(f"  Location : {args.location or 'Global'}")
    print(f"  Pages    : {pages}")
    print(f"  Output   : {output}")
    print(f"  Mode     : {'Fast (no detail)' if args.skip_detail else 'Full (with description)'}")
    print("=" * 60)

    jobs = scrape_jobs(
        query=args.query,
        location=args.location,
        pages=pages,
        delay=args.delay,
        skip_detail=args.skip_detail,
    )

    if not jobs:
        print("\n[!] No jobs scraped. LinkedIn may be blocking requests.")
        print("  Try: --skip-detail, --delay 8, or use a VPN.")
        sys.exit(1)

    save_csv(jobs, output)
    print(f"\n  Next step: Upload '{output}' to http://localhost:3000/admin/import")


if __name__ == "__main__":
    main()
