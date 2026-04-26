import re
from playwright.sync_api import Page, expect

# Test that the page loads and has the correct title
def test_page_loads(page: Page):
    page.goto('http://127.0.0.1:8000/')
    expect(page).to_have_title('Ben Holt | Full Stack Developer')

# Test that the anchor links scroll to the correct sections
def test_page_anchors(page: Page):
    page.goto('http://127.0.0.1:8000/')
    page.wait_for_load_state('networkidle')

    page.click('a[href="#projects"]')
    expect(page.locator('#projects')).to_be_visible()
    page.evaluate('window.scrollTo(0, 0)')

    page.click('a[href="#experience"]')
    expect(page.locator('#experience')).to_be_visible()
    page.evaluate('window.scrollTo(0, 0)')

    page.click('a[href="#education"]')
    expect(page.locator('#education')).to_be_visible()
    page.evaluate('window.scrollTo(0, 0)')

    page.click('a[href="#skills"]')
    expect(page.locator('#skills')).to_be_visible()
    page.evaluate('window.scrollTo(0, 0)')

# Test that CV links work correctly
def test_cv_links(page: Page):
    page.goto('http://127.0.0.1:8000/')
    page.wait_for_load_state('networkidle')
    
    with page.expect_popup() as popup_info:
        page.click('#github-link')
    
    new_tab = popup_info.value
    new_tab.wait_for_load_state('networkidle')
    expect(new_tab).to_have_url(re.compile('github.com'))