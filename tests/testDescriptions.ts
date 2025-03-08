import { test, expect } from '@playwright/test';

const linkList = [
    "https://recovery.pr.gov/en/disaster-recovery",
    "https://recovery.pr.gov/en/coronavirus",
    "https://recovery.pr.gov/en/earthquakes-response",
    "https://recovery.pr.gov/en/hurricanes",
    "https://recovery.pr.gov/en/programs",
    "https://recovery.pr.gov/en/recovery-programs/public-assistance",
    "https://recovery.pr.gov/en/recovery-programs/individual-assistance",
    "https://recovery.pr.gov/en/recovery-programs/hazard-mitigation-assistance",
    "https://recovery.pr.gov/en/recovery-programs/other-recovery-funds",
    "https://recovery.pr.gov/en/recovery-programs/hud",
    "https://recovery.pr.gov/en/recovery-programs/cdl",
    "https://recovery.pr.gov/en/revolving-fund",
    "https://recovery.pr.gov/en/american-rescue-plan",
    "https://recovery.pr.gov/en/cares-act",
    "https://recovery.pr.gov/en/road-to-recovery",
    "https://recovery.pr.gov/en/road-to-recovery/pa-qpr/map",
    "https://recovery.pr.gov/en/road-to-recovery/pa-qpr-fiona/map",
    "https://recovery.pr.gov/en/road-to-recovery/pa-faast/map",
    "https://recovery.pr.gov/en/road-to-resilience/hmgp-qpr/map",
    "https://recovery.pr.gov/en/cares-act-programs",
    "https://recovery.pr.gov/en/deputy-executive-director",
    "https://recovery.pr.gov//en",
    "https://recovery.pr.gov/en/financial-analysis",
    "https://recovery.pr.gov/en/financial-analysis/financial-summary",
    "https://recovery.pr.gov/en/financial-analysis/aid-flow",
    "https://recovery.pr.gov/en/financial-analysis/table-view",
    "https://recovery.pr.gov/en/interactive-map",
    "https://recovery.pr.gov/en/financial-analysis/data-visualization",
    "https://recovery.pr.gov/en/financial-analysis/disbursement-dashboard",
    "https://recovery.pr.gov/en/rfp-and-contracts",
    "https://recovery.pr.gov/en/document-library",
    "https://recovery.pr.gov/en/cor3-rfps-and-contracts",
    "https://recovery.pr.gov/en/subgrantee-procurement",
    "https://recovery.pr.gov/en/cor3-rfps-and-contracts/grouped-rfps-and-contracts",
    "https://recovery.pr.gov/en/cor3-rfps-and-contracts/active-rfps",
    "https://recovery.pr.gov/en/subgrantee-procurement/inventory",
    "https://recovery.pr.gov/en/subgrantee-procurement/active-requests",
    "https://recovery.pr.gov/en/subgrantee-procurement/reconstruction-map",
    "https://recovery.pr.gov/en/about-us",
    "https://recovery.pr.gov/en/cor3-procurement-process",
    "https://recovery.pr.gov/en/subgrantee-procurement-process",
    "https://recovery.pr.gov/en/procurement-tools",
    "https://recovery.pr.gov/en/faq",
    "https://recovery.pr.gov/en/glossary",
    "https://recovery.pr.gov/en/contact-us",
    "https://recovery.pr.gov/en/newsroom",
    "https://recovery.pr.gov/en/newsroom/press-releases",
    "https://recovery.pr.gov/en/newsroom/media-gallery",
    "https://recovery.pr.gov/en/newsroom/blogs",
    "https://recovery.pr.gov/en/fraud-waste-and-abuse"
]

test('Check descriptions', async ({ page }) => {
  page.setViewportSize({ width: 1700, height: 1080 });

  for(const link of linkList){
    await page.goto(link);
    await page.waitForTimeout(500);
    const description = await page.getByRole('heading', { name: 'Description' });
    console.log(link, description)
  }
})