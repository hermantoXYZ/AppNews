from rest_framework import serializers
from .models import User, Category, Article

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'role', 'bio', 'profile_picture', 'date_joined', 'updated_at')
        read_only_fields = ('date_joined', 'updated_at')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data.get('password'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'contributor'),
            bio=validated_data.get('bio', '')
        )
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'created_at', 'updated_at')
        read_only_fields = ('slug', 'created_at', 'updated_at')

class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Article
        fields = (
            'id', 'title', 'slug', 'content', 'summary', 
            'featured_image', 'author', 'category', 'category_name',
            'status', 'views_count', 'created_at', 'updated_at', 
            'published_at'
        )
        read_only_fields = (
            'slug', 'author', 'views_count', 
            'created_at', 'updated_at', 'published_at'
        )

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data) 