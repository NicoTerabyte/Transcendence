from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import User
from .serializer import UserSerializer
from .models import Post
from .serializer import PostSerializer
from . import matchmaking, debug_print

@api_view(['GET'])
def get_users(request):
	users = User.objects.all()
	serializer = UserSerializer(users, many=True)
	return Response(serializer.data)

#view to save multiple users in case of tournament case
#until now i haven't worked with databases in django
#those datas will be put in the user model (table)
#the serialized data goes back to the frontend
#the frontend will use this data to display the users
#response expects single list of user

@api_view(['POST'])
def	save_user_for_tournament(request):
	# Expecting a JSON array of names: {"names": ["Alice", "Bob", "Charlie"]}
	print('\033[32m ready to save the usernames passed in the tournament \033[0m')
	print(request.data)

	names = request.data.get('names', [])
	print(names)

	if not isinstance(names, list):
		return Response({'error': 'Names must be a list'}, status=status.HTTP_400_BAD_REQUEST)

	saved_users = []
	for name in names:
		# Create User instances
		# and i save them in their db
		# so if i remove one it won't be much of a hassle
		user, created = User.objects.get_or_create(name=name)
		if created:
			print(f'\033[42mCreated user {user.name}\033[0m')
		else:
			print(f'\033[41mUser {user.name} already exists\033[0m')
		saved_users.append(user)

	if (len(saved_users) % 2 != 0):
		print("\033[31modd number of users \033[0m")
		saved_users = matchmaking.remove_user_temporarily(saved_users)

	matchmaked_users = matchmaking.matchmaking(saved_users)
	debug_print.debug_print_user_matchmaking(matchmaked_users)
	serializer = UserSerializer(matchmaked_users, many=True)
	debug_print.debug_print_user_matchmaking(saved_users)
	debug_print.printUserDb()
	return Response(serializer.data, status=status.HTTP_201_CREATED)

class PostList(APIView):
	def get(self, request):
		posts = Post.objects.all()
		serializer = PostSerializer(posts, many=True)
		return Response(serializer.data)

