---
name: persian-voice
description: Nisha's Persian UI voice and copy rules. Use whenever writing or editing any Persian user-facing text in this repo (frontend strings, backend error messages, Flutter app_fa.arb, emails, docs shown to users), or when asked to "humanize" Persian copy.
---

# Nisha Persian voice

Nisha talks like a helpful person at a small shop: polite, plain, short. Readers are
sellers running a business from their phone and buyers paying card-to-card. Both are busy
and a little anxious about money, so clarity beats charm.

## 1. One register: «شما» with everyday verbs

- Always address the reader as «شما». Never «تو» (no «کردی»، «فروشگاهت»، «بزن»).
- Plural imperative for actions: «وارد کنید»، «ذخیره کنید», not «وارد کن».
- Everyday verbs, not officialese:

| Avoid | Write |
|---|---|
| می‌باشد | است |
| نمایید / نماید | کنید / کند |
| گردید / گردد | شد / شود |
| جهت | برای |
| اقدام به … نمایید | … کنید |
| قادر به … نیستید | نمی‌توانید … |
| در صورتی که | اگر |
| به منظور | برای |
| فوق / مذکور | این |
| لطفاً جهت ادامه … | برای ادامه … |

## 2. Say it short, say it once

- Lead with what matters to the reader. Cut warm-up phrases («لازم به ذکر است»، «همان‌طور که می‌دانید»).
- One idea per sentence. Most UI sentences fit in 12 words.
- Buttons are 1-3 words, verb-led where there is an action: «ذخیره»، «ثبت سفارش»، «ادامه».
- Don't repeat the heading in the first sentence below it.

## 3. Errors, empty states, confirmations

- Error = what happened + what to do. No blame, no bare «خطا!».
  - «بارگذاری نشد. اتصال اینترنت را بررسی کنید و دوباره امتحان کنید.»
- Empty state = why it's empty + the next step. «هنوز سفارشی ندارید. لینک فروشگاه را برای مشتری‌ها بفرستید.»
- Destructive confirmations name the thing and the consequence: «این محصول حذف شود؟ این کار برگشت‌پذیر نیست.»
- Success messages are short and past tense: «ذخیره شد.»

## 4. No machine-writing tells (adapted from blader/humanizer)

- No hype: «بی‌نظیر»، «فوق‌العاده»، «انقلابی»، «حرفه‌ای‌ترین»، «بهترین تجربه».
- No invented authority or numbers: «هزاران فروشگاه»، «مورد اعتماد همه».
- No lists of three just for rhythm, no «نه فقط … بلکه …» contrasts nobody asked for.
- No dashes (— –) inside Persian sentences; use «،» or split the sentence.
- No exclamation marks except real celebrations (first sale, store published).
- Don't translate English idioms literally («تجربه‌ای بی‌دردسر را رقم بزنید» ✗).

## 5. Typography (what Virastar would fix)

- Half-space (ZWNJ, U+200C): «می‌کنید»، «نمی‌شود»، «سفارش‌ها»، «بزرگ‌ترین»، «خانه‌ای»، «کارت‌به‌کارت».
- Persian letters only: «ی» and «ک», never Arabic «ي» «ك».
- Persian punctuation: «،» «؛» «؟» and guillemets «» for quotes.
- Ellipsis is one character «…», not "...".
- No space before punctuation; one space after.
- Numbers shown to users come from `formatMoney` / `fa-IR` formatting; don't hand-write digits in templates.

## 6. Glossary (use these words, consistently)

| Concept | Word |
|---|---|
| seller / seller panel | فروشنده / پنل فروشنده |
| buyer at checkout | خریدار |
| registered shopper account | حساب مشتری |
| order / invoice code / invoice password | سفارش / کد فاکتور / رمز فاکتور |
| payment receipt (screenshot) | رسید پرداخت |
| customer confirmed delivery | تحویل گرفته / تحویل نگرفته |
| card-to-card | کارت‌به‌کارت |
| subscription plan | پلن |
| storefront | ویترین / صفحه فروشگاه |
| sign in / sign up | ورود / ثبت‌نام |
| save / cancel / delete | ذخیره / انصراف / حذف |

## 7. Checking

Run `node scripts/check-persian-copy.mjs` from the repo root. It flags informal «تو» verbs,
officialese, "...", Arabic letters, Latin punctuation inside Persian, and missing half-spaces.
Legal pages (`/terms`, `/privacy`, `/complaints`) are allowed a more formal tone but still use «شما».
