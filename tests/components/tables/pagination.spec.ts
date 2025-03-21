import { test, expect, type Page } from '@playwright/test';
import { mockHttpRequests } from './http-mocks.js';

test('pagination behaviour', async ({ page }) => {
    await mockHttpRequests(page);
    await page.goto('/components/tables/tests');
    await assertFirstPage(page);

    await page.getByRole('button', { name: 'Next' }).first().click();
    await expect(page.getByRole('textbox').first()).toHaveValue('2');

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
      - heading "Simple Table (Example 1)" [level=3]
      - button "Per Page":
        - img
      - table:
        - rowgroup:
          - row "Name Email Component Email (using Link) Phone Created At Updated At Created By":
            - cell "Name":
              - img
            - cell "Email Component"
            - cell "Email (using Link)"
            - cell "Phone"
            - cell "Created At"
            - cell "Updated At"
            - cell "Created By"
        - rowgroup:
          - row /Rochester Catherall rcatherallrr@youtube\\.com rcatherallrr@youtube\\.com \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Rochester Catherall"
            - cell "rcatherallrr@youtube.com":
              - link "rcatherallrr@youtube.com"
            - cell "rcatherallrr@youtube.com":
              - link "rcatherallrr@youtube.com"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Demetris Jeaves djeavesrq@census\\.gov djeavesrq@census\\.gov \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Demetris Jeaves"
            - cell "djeavesrq@census.gov":
              - link "djeavesrq@census.gov"
            - cell "djeavesrq@census.gov":
              - link "djeavesrq@census.gov"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Dedra Ben dbenrp@dedecms\\.com dbenrp@dedecms\\.com Nov \\d+, \\d+ Admin User/:
            - cell "Dedra Ben"
            - cell "dbenrp@dedecms.com":
              - link "dbenrp@dedecms.com"
            - cell "dbenrp@dedecms.com":
              - link "dbenrp@dedecms.com"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Drusi Shortcliffe dshortcliffero@wordpress\\.org dshortcliffero@wordpress\\.org \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Drusi Shortcliffe"
            - cell "dshortcliffero@wordpress.org":
              - link "dshortcliffero@wordpress.org"
            - cell "dshortcliffero@wordpress.org":
              - link "dshortcliffero@wordpress.org"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Koo Stuke kstukern@ft\\.com kstukern@ft\\.com \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Koo Stuke"
            - cell "kstukern@ft.com":
              - link "kstukern@ft.com"
            - cell "kstukern@ft.com":
              - link "kstukern@ft.com"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Lillis Atyea latyearm@si\\.edu latyearm@si\\.edu Nov \\d+, \\d+ Admin User/:
            - cell "Lillis Atyea"
            - cell "latyearm@si.edu":
              - link "latyearm@si.edu"
            - cell "latyearm@si.edu":
              - link "latyearm@si.edu"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Chuck De Micoli cdemicolirl@meetup\\.com cdemicolirl@meetup\\.com \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Chuck De Micoli"
            - cell "cdemicolirl@meetup.com":
              - link "cdemicolirl@meetup.com"
            - cell "cdemicolirl@meetup.com":
              - link "cdemicolirl@meetup.com"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Sarah Boatwright sboatwrightrk@un\\.org sboatwrightrk@un\\.org \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Sarah Boatwright"
            - cell "sboatwrightrk@un.org":
              - link "sboatwrightrk@un.org"
            - cell "sboatwrightrk@un.org":
              - link "sboatwrightrk@un.org"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Felicdad Buddle fbuddlerj@google\\.com\\.au fbuddlerj@google\\.com\\.au \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Felicdad Buddle"
            - cell "fbuddlerj@google.com.au":
              - link "fbuddlerj@google.com.au"
            - cell "fbuddlerj@google.com.au":
              - link "fbuddlerj@google.com.au"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Bibbye Tonkinson btonkinsonri@yolasite\\.com btonkinsonri@yolasite\\.com Nov \\d+, \\d+ Admin User/:
            - cell "Bibbye Tonkinson"
            - cell "btonkinsonri@yolasite.com":
              - link "btonkinsonri@yolasite.com"
            - cell "btonkinsonri@yolasite.com":
              - link "btonkinsonri@yolasite.com"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
      - button "Previous":
        - img
      - text: Page
      - textbox: "2"
      - text: /of \\d+ - total of \\d+ records/
      - button "Next":
        - img
      `);

    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().fill('333');
    await expect(page.getByRole('textbox').first()).toHaveValue('113');

    await expect(page.locator('#main')).toContainText('Page 113 of 113 - total of 1121 records');

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
      - table:
        - rowgroup:
          - row "Name Email Component Email (using Link) Phone Created At Updated At Created By":
            - cell "Name":
              - img
            - cell "Email Component"
            - cell "Email (using Link)"
            - cell "Phone"
            - cell "Created At"
            - cell "Updated At"
            - cell "Created By"
        - rowgroup:
          - row /Mayer Schenkel mschenkel2@zdnet\\.com mschenkel2@zdnet\\.com \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Mayer Schenkel"
            - cell "mschenkel2@zdnet.com":
              - link "mschenkel2@zdnet.com"
            - cell "mschenkel2@zdnet.com":
              - link "mschenkel2@zdnet.com"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Mycah Piola mpiola1@delicious\\.com mpiola1@delicious\\.com \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Mycah Piola"
            - cell "mpiola1@delicious.com":
              - link "mpiola1@delicious.com"
            - cell "mpiola1@delicious.com":
              - link "mpiola1@delicious.com"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Ree Eannetta reannetta0@g\\.co reannetta0@g\\.co \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Ree Eannetta"
            - cell "reannetta0@g.co":
              - link "reannetta0@g.co"
            - cell "reannetta0@g.co":
              - link "reannetta0@g.co"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
      `);
    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().fill('-10');
    await expect(page.getByRole('textbox').first()).toHaveValue('1');
    await expect(page.locator('#main')).toContainText('Page 1 of 113 - total of 1121 records');
    await assertFirstPage(page);
});

async function assertFirstPage(page: Page) {
    await expect(page.locator('#main')).toMatchAriaSnapshot(`
      - heading "Simple Table (Example 1)" [level=3]
      - button "Per Page":
        - img
      - table:
        - rowgroup:
          - row "Name Email Component Email (using Link) Phone Created At Updated At Created By":
            - cell "Name":
              - img
            - cell "Email Component"
            - cell "Email (using Link)"
            - cell "Phone"
            - cell "Created At"
            - cell "Updated At"
            - cell "Created By"
        - rowgroup:
          - row /Zaccaria Padfield zpadfield24@fda\\.gov zpadfield24@fda\\.gov \\d+-\\d+-\\d+ Nov \\d+, \\d+ Admin User/:
            - cell "Zaccaria Padfield"
            - cell "zpadfield24@fda.gov":
              - link "zpadfield24@fda.gov"
            - cell "zpadfield24@fda.gov":
              - link "zpadfield24@fda.gov"
            - cell /\\d+-\\d+-\\d+/:
              - link /\\d+-\\d+-\\d+/
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Anissa Rocca arocca25@ezinearticles\\.com arocca25@ezinearticles\\.com Nov \\d+, \\d+ 4 months ago Admin User/:
            - cell "Anissa Rocca"
            - cell "arocca25@ezinearticles.com":
              - link "arocca25@ezinearticles.com"
            - cell "arocca25@ezinearticles.com":
              - link "arocca25@ezinearticles.com"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell "4 months ago"
            - cell "Admin User"
          - row /Jarrad O'Donoghue jodonoghue26@desdev\\.cn jodonoghue26@desdev\\.cn Nov \\d+, \\d+ Admin User/:
            - cell "Jarrad O'Donoghue"
            - cell "jodonoghue26@desdev.cn":
              - link "jodonoghue26@desdev.cn"
            - cell "jodonoghue26@desdev.cn":
              - link "jodonoghue26@desdev.cn"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Codi McIllrick cmcillrick27@narod\\.ru cmcillrick27@narod\\.ru Nov \\d+, \\d+ Admin User/:
            - cell "Codi McIllrick"
            - cell "cmcillrick27@narod.ru":
              - link "cmcillrick27@narod.ru"
            - cell "cmcillrick27@narod.ru":
              - link "cmcillrick27@narod.ru"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Elisha Doberer edoberer28@miitbeian\\.gov\\.cn edoberer28@miitbeian\\.gov\\.cn Nov \\d+, \\d+ Admin User/:
            - cell "Elisha Doberer"
            - cell "edoberer28@miitbeian.gov.cn":
              - link "edoberer28@miitbeian.gov.cn"
            - cell "edoberer28@miitbeian.gov.cn":
              - link "edoberer28@miitbeian.gov.cn"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Benedicta Inmett binmett29@kickstarter\\.com binmett29@kickstarter\\.com Nov \\d+, \\d+ Admin User/:
            - cell "Benedicta Inmett"
            - cell "binmett29@kickstarter.com":
              - link "binmett29@kickstarter.com"
            - cell "binmett29@kickstarter.com":
              - link "binmett29@kickstarter.com"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Adair Vinker avinker2a@cyberchimps\\.com avinker2a@cyberchimps\\.com Nov \\d+, \\d+ Admin User/:
            - cell "Adair Vinker"
            - cell "avinker2a@cyberchimps.com":
              - link "avinker2a@cyberchimps.com"
            - cell "avinker2a@cyberchimps.com":
              - link "avinker2a@cyberchimps.com"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Talia Hartopp thartopp2b@stumbleupon\\.com thartopp2b@stumbleupon\\.com Nov \\d+, \\d+ Admin User/:
            - cell "Talia Hartopp"
            - cell "thartopp2b@stumbleupon.com":
              - link "thartopp2b@stumbleupon.com"
            - cell "thartopp2b@stumbleupon.com":
              - link "thartopp2b@stumbleupon.com"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Blanca Spriddle bspriddle2c@marketwatch\\.com bspriddle2c@marketwatch\\.com Nov \\d+, \\d+ Admin User/:
            - cell "Blanca Spriddle"
            - cell "bspriddle2c@marketwatch.com":
              - link "bspriddle2c@marketwatch.com"
            - cell "bspriddle2c@marketwatch.com":
              - link "bspriddle2c@marketwatch.com"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
          - row /Ivy Melloi imelloi23@soup\\.io imelloi23@soup\\.io Nov \\d+, \\d+ Admin User/:
            - cell "Ivy Melloi"
            - cell "imelloi23@soup.io":
              - link "imelloi23@soup.io"
            - cell "imelloi23@soup.io":
              - link "imelloi23@soup.io"
            - cell
            - cell /Nov \\d+, \\d+/
            - cell
            - cell "Admin User"
      - button "Previous" [disabled]:
        - img
      - text: Page
      - textbox: "1"
      - text: /of \\d+ - total of \\d+ records/
      - button "Next":
        - img
      `);
}
