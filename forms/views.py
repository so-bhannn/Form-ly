from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from accounts.permissions import IsOwnerOrReadOnly
from .models import Form
from .serializers import FormReadSerializer,FormWriteSerializer,ResponseListSerializer,FormWithResponseSerializer,ResponseSubmitSerializer

class FormViewSet(ModelViewSet):
    permission_classes=[IsOwnerOrReadOnly]
    queryset=Form.objects.all()

    def get_serializer_class(self):
        if self.action in ['create','update','partial_update']:
            return FormWriteSerializer
        elif self.action == 'submit':
            return ResponseSubmitSerializer
        elif self.action == 'responses':
            return ResponseListSerializer
        elif self.action == 'aggregated_response':
            return FormWithResponseSerializer
        return FormReadSerializer

    def get_queryset(self):
        
        queryset=super().get_queryset()
        user= self.request.user

        if self.action == 'list':
            if user.is_authenticated:
                return queryset.filter(owner=user)
            return Form.objects.none()
        
        elif self.action=='aggregated_response':
            return queryset.prefetch_related(
                'questions__options',
                'questions__answers'
            )
        elif self.action=='responses':
            return queryset.prefetch_related(
                'questions__options'
            )
        
        return queryset

    def get_serializer_context(self):
        return {'request': self.request}
    
    @action(
            detail=True,
            methods=['post']
    )
    def submit(self,request,pk=None):
        form=self.get_object()
        serializer = self.get_serializer(data=request.data, context={'form':form,'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message':'Your response was recorded.'
        })

    @action(
            detail=True,
            methods=['get'],
            serializer_class=ResponseListSerializer
    )
    def responses(self,request,pk=None):
        form= self.get_object()
        queryset=form.responses.all().order_by('-submitted_at')

        page=self.paginate_queryset(queryset)
        if page is not None:
            serializer=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializer.data)
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)
    
    @action(
        detail=True,
        methods=['get'],
        serializer_class=FormWithResponseSerializer
    )
    def aggregated_response(self,request,pk=None):
        base_queryset=self.get_queryset()
        form=base_queryset.prefetch_related('questions__answers').get(pk=pk)

        serializer=self.get_serializer(form)

        return Response(serializer.data)