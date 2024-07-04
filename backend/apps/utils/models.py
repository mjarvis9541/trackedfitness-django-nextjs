# from django.db import models

# from utils.storages import PrivateMediaStorage


# class Document(models.Model):
#     """Testing public uploads."""

#     title = models.CharField(max_length=255)
#     upload = models.FileField(upload_to="documents/")
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title


# class PrivateDocument(models.Model):
#     """Testing private uploads."""

#     title = models.CharField(max_length=255)
#     upload = models.FileField(upload_to="private_documents/", storage=PrivateMediaStorage())
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title
