# Generated by Django 2.2.2 on 2021-07-26 08:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('uspl', '0002_auto_20210715_1341'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='expected_date',
        ),
    ]
