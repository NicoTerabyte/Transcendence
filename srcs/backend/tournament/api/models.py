from django.db import models

# Create your models here
# model to handle user data
class User(models.Model):
	# age = models.IntegerField()
	name = models.CharField(max_length=100, unique=True)
	# is_matched = models.BooleanField(default=False)
	def __str__(self):
		return self.name

#For myself testing out
class Post(models.Model):
	title = models.CharField(max_length=100)
	content = models.TextField()
	create_at = models.DateTimeField(auto_now_add=True)
	def __str__(self):
		return self.title

