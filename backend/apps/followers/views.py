from rest_framework import views, viewsets
from rest_framework.response import Response

from apps.followers.models import UserFollowing
from apps.followers.serializers import UserFollowingSerializer


class UserFollowingViewSet(viewsets.ModelViewSet):
    serializer_class = UserFollowingSerializer
    queryset = UserFollowing.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_delete(self, serializer):
        serializer.save(user=self.request.user)


class UserFollowingAPIView(views.APIView):
    def post(self, request, format=None):
        request.user.connections.add(request.data["following"])
        return Response({"detail": "ok"})

    def delete(self, request, format=None):
        request.user.connections.remove(request.data["following"])
        return Response({"detail": "ok"})
