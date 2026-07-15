#!/bin/bash
set -e
FILES=("index.html")

replace() {
  for f in "${FILES[@]}"; do
    sed -i '' "s/$1/$2/g" "$f"
  done
}

# 深い階層 → 独立したBlockへ(必ず長い文字列から先に置換)
replace 'l-header__nav-list' 'nav__list'
replace 'l-header__nav-item' 'nav__item'
replace 'l-header__nav-link' 'nav__link'
replace 'l-header__nav' 'nav'

replace 'l-footer__nav-group' 'footer-nav__group'
replace 'l-footer__nav-title' 'footer-nav__title'
replace 'l-footer__nav-list' 'footer-nav__list'
replace 'l-footer__nav-item' 'footer-nav__item'
replace 'l-footer__nav-link' 'footer-nav__link'
replace 'l-footer__nav' 'footer-nav'

replace 'l-footer__legal-list' 'legal__list'
replace 'l-footer__legal-item' 'legal__item'
replace 'l-footer__legal-link' 'legal__link'

replace 'p-hero__badge-label' 'badge__label'
replace 'p-hero__badge-count' 'badge__count'
replace 'p-hero__badge' 'badge'

replace 'p-integrations__card-title' 'system-card__title'
replace 'p-integrations__card' 'system-card'
replace 'p-integrations__logo-list' 'logo-list'
replace 'p-integrations__logo-item' 'logo-list__item'

replace ' p-merits__item--reverse' ''

# 接頭辞だけ削除(残りはこれで全部変換される)
replace 'l-header' 'header'
replace 'l-footer' 'footer'
replace 'p-hero' 'hero'
replace 'p-clients' 'clients'
replace 'p-concept' 'concept'
replace 'p-merits' 'merits'
replace 'p-cta-banner' 'cta-banner'
replace 'p-flow' 'flow'
replace 'p-integrations' 'integrations'
replace 'p-security' 'security'
replace 'p-faq' 'faq'
replace 'p-support-cta' 'support-cta'

echo "HTML rename done."
