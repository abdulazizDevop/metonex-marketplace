from django.urls import path
from . import views

urlpatterns = [
    path('', views.RazmerListCreateView.as_view(), name='razmer-list-create'),
    path('<uuid:pk>/', views.RazmerDetailView.as_view(), name='razmer-detail'),
    path('by-subcategory/<uuid:subcategory_id>/', views.get_razmers_by_subcategory, name='razmers-by-subcategory'),
]
