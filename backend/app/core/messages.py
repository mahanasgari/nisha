from __future__ import annotations

from typing import Final

_EXACT_TRANSLATIONS: Final[dict[str, str]] = {
    "Conversation not found": "گفتگو پیدا نشد",
    "Order not found": "سفارش پیدا نشد",
    "Store not found": "فروشگاه پیدا نشد",
    "Product not found": "محصول پیدا نشد",
    "Payment method not found": "روش پرداخت پیدا نشد",
    "Image not found": "تصویر پیدا نشد",
    "Field not found": "فیلد پیدا نشد",
    "Badge not found": "نشان پیدا نشد",
    "Social link not found": "لینک اجتماعی پیدا نشد",
    "Review not found": "نظر پیدا نشد",
    "Address not found": "آدرس پیدا نشد",
    "Account not found": "حساب پیدا نشد",
    "Recovery request not found": "درخواست بازیابی پیدا نشد",
    "Recovery code already used": "این کد قبلاً استفاده شده است. یک کد تازه بگیرید.",
    "Recovery code expired": "این کد منقضی شده است. یک کد تازه بگیرید.",
    "Invalid recovery code": "کد بازیابی درست نیست.",
    "Could not create conversation": "گفتگو باز نشد. دوباره امتحان کنید.",
    "Could not create product": "محصول ساخته نشد. دوباره امتحان کنید.",
    "Could not update product": "تغییرات محصول ذخیره نشد. دوباره امتحان کنید.",
    "Could not create image": "عکس اضافه نشد. دوباره امتحان کنید.",
    "Could not update image": "تغییر عکس ذخیره نشد. دوباره امتحان کنید.",
    "Could not reorder images": "ترتیب عکس‌ها ذخیره نشد. دوباره امتحان کنید.",
    "Could not create field": "سؤال سفارشی اضافه نشد. دوباره امتحان کنید.",
    "Could not update field": "سؤال سفارشی ذخیره نشد. دوباره امتحان کنید.",
    "Could not reorder fields": "ترتیب سؤال‌ها ذخیره نشد. دوباره امتحان کنید.",
    "Could not create social link": "لینک اضافه نشد. دوباره امتحان کنید.",
    "Could not update social link": "تغییر لینک ذخیره نشد. دوباره امتحان کنید.",
    "Could not delete social link": "لینک حذف نشد. دوباره امتحان کنید.",
    "Could not reorder social links": "ترتیب لینک‌ها ذخیره نشد. دوباره امتحان کنید.",
    "Could not create order": "سفارش ثبت نشد. دوباره امتحان کنید.",
    "Could not create payment method": "روش پرداخت اضافه نشد. دوباره امتحان کنید.",
    "Could not update payment method": "تغییر روش پرداخت ذخیره نشد. دوباره امتحان کنید.",
    "Could not delete payment method": "روش پرداخت حذف نشد. دوباره امتحان کنید.",
    "Could not generate unique invoice code, please retry": "سفارش ثبت نشد. لطفاً دوباره امتحان کنید.",
    "Invalid invoice credentials": "کد یا رمز فاکتور درست نیست.",
    "Order cannot be edited after payment is confirmed": "بعد از تایید پرداخت، سفارش دیگر قابل ویرایش نیست.",
    "Payment proof cannot be uploaded for this order status": "در این مرحله نمی‌توانید برای این سفارش رسید بفرستید.",
    "File too large": "حجم فایل بیش از حد مجاز است",
    "Empty file": "فایل خالی است",
    "File is required": "فایلی انتخاب نشده است.",
    "Only image files are allowed": "فقط عکس می‌توانید بارگذاری کنید.",
    "Invalid image file content": "این فایل عکس سالم نیست. عکس دیگری انتخاب کنید.",
    "Invalid image order": "ترتیب تصویر نامعتبر است",
    "Invalid field order": "ترتیب فیلد نامعتبر است",
    "Invalid social link order": "ترتیب لینک اجتماعی نامعتبر است",
    "Store update failed due to a constraint conflict": "تنظیمات فروشگاه ذخیره نشد. دوباره امتحان کنید.",
    "Cannot delete payment method with existing references": "این روش پرداخت در سفارش‌ها استفاده شده و حذف‌شدنی نیست؛ به‌جای حذف، غیرفعالش کنید.",
    "Slug already taken": "این آدرس فروشگاه قبلاً گرفته شده است؛ آدرس دیگری انتخاب کنید.",
    "Could not validate credentials": "نشست شما تمام شده است. دوباره وارد شوید.",
    "Too many recovery requests. Please try again later.": "درخواست بازیابی زیادی فرستاده‌اید. کمی بعد دوباره امتحان کنید.",
    "Too many failed attempts. Please request a new code.": "چند بار کد اشتباه وارد شد. یک کد تازه بگیرید.",
    "Email not verified": "ایمیل شما هنوز تایید نشده است. لینک داخل ایمیل را باز کنید.",
    "Invalid or expired verification token": "این لینک تایید معتبر نیست یا منقضی شده است.",
    "Too many verification requests. Please try again later.": "درخواست زیادی فرستاده‌اید. کمی بعد دوباره امتحان کنید.",
    "Invalid verification kind": "لینک تایید معتبر نیست.",
    "Order already claimed by another customer": "این سفارش قبلاً به حساب دیگری اضافه شده است.",
    "Complaint is only available for active delivery orders": "برای این سفارش در حال حاضر نمی‌توانید شکایت ثبت کنید.",
    "Reviews are available after delivery": "بعد از تحویل سفارش می‌توانید نظر بدهید.",
    "Only pending reviews can be approved": "فقط نظرهای در انتظار بررسی را می‌شود تایید کرد.",
    "Only pending reviews can be rejected": "فقط نظرهای در انتظار بررسی را می‌شود رد کرد.",
    "Invalid login or password": "ایمیل/تلفن یا رمز عبور درست نیست.",
    "Invalid email or password": "ایمیل یا رمز عبور درست نیست.",
    "Email already registered": "با این ایمیل قبلاً حساب ساخته شده است. وارد شوید یا رمز را بازیابی کنید.",
    "Account is inactive": "این حساب غیرفعال است. با پشتیبانی تماس بگیرید.",
    "Email or password is invalid": "ایمیل یا رمز عبور درست نیست.",
    "At least one of email or phone is required": "ایمیل یا شماره تلفن را وارد کنید؛ یکی کافی است.",
    "Phone already registered": "با این شماره قبلاً حساب ساخته شده است. وارد شوید یا رمز را بازیابی کنید.",
    "This account already exists": "این حساب از قبل وجود دارد. وارد شوید.",
    "No changes provided": "تغییری برای ذخیره وجود ندارد.",
    "store_id and customer_id are required": "شناسه فروشگاه و مشتری الزامی هستند",
    "At least one field must be provided": "حداقل یک فیلد باید ارسال شود",
    "card_number and owner_name are required for CARD_TO_CARD": "برای کارت‌به‌کارت، شماره کارت و نام صاحب حساب را وارد کنید.",
    "wallet_address is required for CRYPTO": "برای رمزارز، آدرس کیف پول را وارد کنید.",
    "external_url is required for EXTERNAL_GATEWAY": "برای درگاه پرداخت، لینک درگاه را وارد کنید.",
    "Invalid token": "لینک یا نشست شما معتبر نیست. دوباره وارد شوید.",
}

_PREFIX_TRANSLATIONS: Final[list[tuple[str, str]]] = [
    ("Product is not available: ", "محصول در دسترس نیست: "),
    ("Insufficient stock for ", "موجودی برای این مورد کافی نیست: "),
    ("Invalid value for ", "مقدار نامعتبر برای "),
    ("Unsupported field type: ", "نوع فیلد پشتیبانی نمی‌شود: "),
    ("Unknown field: ", "فیلد ناشناخته: "),
    ("Duplicate field: ", "فیلد تکراری: "),
    ("Cannot confirm payment from status ", "امکان تایید پرداخت در وضعیت "),
    ("Cannot reject payment from status ", "امکان رد پرداخت در وضعیت "),
    ("Cannot change status from terminal state ", "امکان تغییر وضعیت از حالت نهایی "),
    ("Invalid status transition from ", "تغییر وضعیت نامعتبر از "),
]


def _translate_dynamic_message(message: str) -> str | None:
    if message.endswith(" file is required"):
        field_name = message[: -len(" file is required")]
        return f"بارگذاری فایل برای {field_name} الزامی است"

    if message.endswith(" is required"):
        field_name = message[: -len(" is required")]
        return f"{field_name} الزامی است"

    if message.endswith(" must be a number"):
        field_name = message[: -len(" must be a number")]
        return f"{field_name} باید یک عدد باشد"

    if message.endswith(" must be true or false"):
        field_name = message[: -len(" must be true or false")]
        return f"{field_name} باید درست یا نادرست باشد"

    return None


def translate_backend_message(message: str) -> str:
    if message in _EXACT_TRANSLATIONS:
        return _EXACT_TRANSLATIONS[message]

    dynamic_translation = _translate_dynamic_message(message)
    if dynamic_translation is not None:
        return dynamic_translation

    for prefix, translated_prefix in _PREFIX_TRANSLATIONS:
        if message.startswith(prefix):
            return f"{translated_prefix}{message[len(prefix):]}"

    return message
