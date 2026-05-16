from django.contrib import admin

from .models import (
    Profile,
    Tutorship,
    Application
)

admin.site.register(Profile)
admin.site.register(Tutorship)
admin.site.register(Application)