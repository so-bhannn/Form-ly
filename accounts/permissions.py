from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET','HEAD','OPTIONS'] or view.action == 'submit':
            return True
        
        if not request.user or not request.user.is_authenticated:
            return False
        
        return obj.owner == request.user