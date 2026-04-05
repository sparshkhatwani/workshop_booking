from django.urls import path, re_path
from . import views
# from django.conf.urls import url

from cms import views

app_name = "cms"

urlpatterns = [
    # url('^$', views.home, name='home'),
    # url('^(?P<permalink>.+)$', views.home, name='home')
    path('', views.home, name='home'),
    re_path(r'^(?P<permalink>.+)$', views.home, name='home'),
]