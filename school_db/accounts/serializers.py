from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'password', 'parent')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        parent = validated_data.pop('parent', None)
        user = User(**validated_data)
        user.set_password(validated_data['password'])

        if user.role == 'student' and parent:
            try:
                user.parent = User.objects.get(email=parent, role='parent')
            except User.DoesNotExist:
                raise serializers.ValidationError({'parent': 'Parent not found'})

        user.save()
        return user