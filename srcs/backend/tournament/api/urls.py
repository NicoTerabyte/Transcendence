from django.urls import path, include
from .views import get_users
from .views import PostList
from .views import save_user_for_tournament, update_match_winner
#we doing different operations that involves tables in the database
#we need to create a url for each operation
urlpatterns = [
	path('users/', get_users, name='get_users'),
	path('users/get/', get_users, name='get_user'),
	path('posts/',PostList.as_view(), name='post_list'),
	path('users/save/', save_user_for_tournament, name='save_user_for_tournament'),
	path('users/delete/', update_match_winner, name='update_match_winner'),
]

