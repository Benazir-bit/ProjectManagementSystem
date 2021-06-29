from django import template

register = template.Library()

@register.filter
def get_cld_tasks(obj):
    return obj.get_cld_tasks_count()