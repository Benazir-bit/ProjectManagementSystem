from django import forms
from django.contrib.auth.models import User, Group
from django.forms import ModelForm
from .models import Project, Task, Profile, Kpi, Teamleader, Designation
from django.contrib.auth.forms import UserCreationForm


class SearchForm(forms.Form):
    "Search"
    q = forms.CharField(
        widget=forms.TextInput(attrs={'size': 35})
    )


class CreateGroupForm(ModelForm):
    class Meta:
        model = Group
        fields = ('name',)


class UpdateGroupForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super(UpdateGroupForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Group
        exclude = []


class UpdateGroupTeamleaderForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super(UpdateGroupTeamleaderForm, self).__init__(*args, **kwargs)
        group = kwargs.get('initial').get('group')
        self.fields['users'].queryset = group.user_set.all()
        self.fields['users'].label_from_instance = lambda obj: "%s (%s)" % (
            obj.get_full_name(), obj.username)
        self.fields['users'].widget.attrs = {
            'id': 'id_assigned_to', 'class': "custom-select mb-3", 'name': 'assigned_to'}

    class Meta:
        model = Teamleader
        exclude = ['group']


class AddEditTaskForm(ModelForm):
    """The picklist showing the users to which a new task can be assigned
    must find other members of the group this TaskList is attached to."""

    def __init__(self, user, *args, **kwargs):
        super(AddEditTaskForm, self).__init__(*args, **kwargs)
        project = kwargs.get('initial').get('project')
        members = project.group.user_set.all()
        self.fields['assigned_to'].queryset = members
        self.fields['assigned_to'].label_from_instance = lambda obj: "%s (%s)" % (
            obj.get_full_name(), obj.username)
        self.fields['assigned_to'].widget.attrs = {
            'id': 'id_assigned_to', 'class': "custom-select mb-3", 'name': 'assigned_to'}
        self.fields['project'].value = kwargs['initial']['project'].id

    due_date = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False)
    name = forms.CharField(widget=forms.widgets.TextInput())
    note = forms.CharField(widget=forms.Textarea(), required=False)

    class Meta:
        model = Task
        exclude = []


class AddProjectForm(ModelForm):
    """The picklist showing allowable groups to which a new list can be added
    determines which groups the user belongs to. This queries the form object
    to derive that list."""

    def __init__(self, user, *args, **kwargs):
        super(AddProjectForm, self).__init__(*args, **kwargs)
    due_date = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False)

    class Meta:
        model = Project
        exclude = ['group', 'created_date', 'slug',
                   'completed', 'completed_date', 'created_by']


class UpdateProjectForm(ModelForm):
    due_date = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False)

    def __init__(self, *args, **kwargs):
        super(UpdateProjectForm, self).__init__(*args, **kwargs)
        self.fields['supervisor'].label_from_instance = lambda obj: "%s" % obj.get_full_name()
        self.fields['supervisor'].label_from_instance = lambda obj: "%s (%s)" % (
            obj.get_full_name(), obj.username)
        self.fields['details'].widget.attrs = {
            'id': 'id_details', 'rows': "10", 'col': 'auto', 'required': True}
        self.fields['note'].widget.attrs = {
            'id': 'id_note', 'rows': "10", 'col': 'auto'}

    class Meta:
        model = Project
        exclude = ['group', 'created_by', 'created_date', 'slug']


class AddTaskForm(ModelForm):
    """The picklist showing the users to which a new task can be assigned
    must find other members of the group this TaskList is attached to."""

    def __init__(self, user, *args, **kwargs):
        super(AddTaskForm, self).__init__(*args, **kwargs)
        project = kwargs.get('initial').get('project')
        members = project.group.user_set.all()
        self.fields['assigned_to'].queryset = members
        self.fields['assigned_to'].label_from_instance = lambda obj: "%s (%s)" % (
            obj.get_full_name(), obj.username)
        self.fields['assigned_to'].widget.attrs = {
            'id': 'id_assigned_to', 'class': "custom-select mb-3", 'name': 'assigned_to', 'required': True, 'style': 'width:90%'}
    deadline = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False)
    note = forms.CharField(widget=forms.Textarea(), required=False)

    class Meta:
        model = Task
        exclude = ['project', 'priority', 'started', 'created_date',
                   'started_date', 'completed', 'completed_date', 'submitted', 'reviewed', ]


class UpdateTaskForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super(UpdateTaskForm, self).__init__(*args, **kwargs)
        project = kwargs.get('initial').get('project')
        members = project.group.user_set.all()
        self.fields['assigned_to'].queryset = members
        self.fields['assigned_to'].label_from_instance = lambda obj: "%s (%s)" % (
            obj.get_full_name(), obj.username)
        self.fields['assigned_to'].widget.attrs = {
            'id': 'id_assigned_to', 'class': "custom-select mb-3", 'name': 'assigned_to'}
    deadline = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False)

    class Meta:
        model = Task
        fields = ('name', 'details', 'deadline',
                  'assigned_to', 'note', 'priority',)


# User, Group forms
class CreateUserForm(UserCreationForm):
    phone_number = forms.CharField(max_length=11)
    present_address = forms.CharField(max_length=100)
    highest_degree = forms.CharField(max_length=100)
    date_of_joining = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False, help_text='Required. Format: YYYY-MM-DD')
    date_of_birth = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False)
    blood_group = forms.CharField(max_length=3)
    emergency_contact = forms.CharField(max_length=11)
    group = forms.ModelMultipleChoiceField(
        queryset=Group.objects.all(), required=True)
    reports_to = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(), required=True)
    image = forms.ImageField(required=False)
    #dsg = forms.ChoiceField()

    def __init__(self, *args, **kwargs):
        super(CreateUserForm, self).__init__(*args, **kwargs)
        self.fields['password1'].required = False
        #self.fields['dsg'].queryset = Designation.objects.none()
        del self.fields['password2']

        # if 'group' in self.data:
        #    try:
        #        group_id = int(self.data.get('group'))
        #        self.fields['dsg'].queryset = Designation.objects.filter(group__id=group_id)
        #    except (ValueError, TypeError):
        #        pass  # invalid input from the client; ignore and fallback to empty City queryset
        # elif self.instance.pk:
        #    self.fields['dsg'].queryset = self.instance.group.designation_set.all.order_by('title')

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'group',
                  'date_of_birth', 'phone_number', 'present_address', 'highest_degree', 'blood_group', 'emergency_contact', 'date_of_joining', 'image', 'reports_to')


class UpdateProfileForm(ModelForm):
    designation_choices = (
        ('Senior Engineer', 'Senior Engineer'),
        ('Engineer', 'Engineer'),
        ('Associate Engineer', 'Associate Engineer'),
        ('Trainee Engineer', 'Trainee Engineer'),
    )
    phone_number = forms.CharField(max_length=11)
    present_address = forms.CharField(max_length=100)
    highest_degree = forms.CharField(max_length=100)
    emergency_contact = forms.CharField(max_length=11)

    class Meta:
        model = User
        fields = ('phone_number', 'present_address',
                  'highest_degree', 'emergency_contact',)


class UpdateProfileFormHR(ModelForm):
    designation_choices = (
        ('Senior Engineer', 'Senior Engineer'),
        ('Engineer', 'Engineer'),
        ('Associate Engineer', 'Associate Engineer'),
        ('Trainee Engineer', 'Trainee Engineer'),
    )
    phone_number = forms.CharField(max_length=11)
    present_address = forms.CharField(max_length=100)
    highest_degree = forms.CharField(max_length=100)
    date_of_joining = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    designation = forms.ChoiceField(choices=designation_choices)
    date_of_birth = forms.DateField(widget=forms.DateInput(
        attrs={'type': 'date'}), required=False)
    blood_group = forms.CharField(max_length=2, required=False)
    emergency_contact = forms.CharField(max_length=11)
    teamleader = forms.BooleanField(required=False)

    class Meta:
        model = User
        fields = ('designation', 'teamleader', 'date_of_birth', 'date_of_joining', 'phone_number',
                  'present_address', 'highest_degree', 'blood_group', 'emergency_contact',)


class TaskKPIForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(TaskKPIForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs = {'type': 'number', 'max': '10',
                                  'min': '0', 'required': 'true', 'class': 'form-control'}
            field.required = True

    class Meta:
        model = Kpi
        fields = ('skill', 'attitude', 'motivation',
                  'communication', 'time_management', 'reliability')
