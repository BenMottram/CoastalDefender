from django.db import models
from django import forms
from django.forms import ModelForm

class mapFrame (models.Model):
    frame = models.CharField(max_length=20)

    def __unicode__(self):
        return self.frame

class gameState (models.Model):
    terrainString = models.TextField()

    def __unicode__(self):
        return self.terrainString


class gameStateHistory (models.Model):
    historyString = models.CommaSeparatedIntegerField(max_length=200, blank=True)

    def __unicode__(self):
        return self.historyString

class gameIntroduction (models.Model):
    textString = models.TextField()

    def __unicode__(self):
        return self.textString

class textEntry (models.Model):
    heading = models.CharField(max_length=50)
    body = models.TextField()
    order = models.IntegerField()

    def __unicode__(self):
        return self.heading
        return self.body

stronglyDisagree = "SD"
disagree = "D"
netural = "N"
agree = "A"
stronglyAgree = "SA"
DecisionChoices = (
    (stronglyDisagree, "Strongly Disagree"),
    (disagree, "Disagree"),
    (netural, "Neither agree or disagree"),
    (agree, "Agree"),
    (stronglyAgree, "Stongly Agree"),
    )

yes = "Yes"
no = "no"
shareChoices = (
    (yes, "Yes"),
    (no, "No"),
    )


range1 = "<18"
range2 = "18-24"
range3 = "25-34"
range4 = "35-44"
range5 = "45-54"
range6 = "55-64"
range7 = "65 or older"
ageChoices = (
    (range1, "less than 18"),
    (range2, "18-24"),
    (range3, "25-34"),
    (range4, "35-44"),
    (range5, "45-54"),
    (range6, "55-64"),
    (range7, "65 or older"),
    )

male = "male"
female = "female"
genderChoices = (
    (male, "Male"),
    (female, "Female"),
    )


class questionaire (models.Model):
    gameId = models.IntegerField()
    question1 = models.CharField(max_length=200, choices = DecisionChoices)
    question2 = models.CharField(max_length=200, choices = DecisionChoices)
    question3 = models.CharField(max_length=200, choices = DecisionChoices)
    question4 = models.CharField(max_length=200, choices = DecisionChoices)
    question5 = models.CharField(max_length=200, choices = DecisionChoices)
    question6 = models.CharField(max_length=20, choices = shareChoices)
    question7 = models.CharField(max_length=20, choices = ageChoices)
    question8 = models.CharField(max_length=20, choices = genderChoices)
    

    def __unicode__(self):
        return self.question1
        return self.question2
        return self.question3
        return self.question4
        return self.question5
        return self.question6
        return self.question7
        return self.question8
            
class questionData (ModelForm):
    def __init__(self, *args, **kwargs):
        super(questionData, self).__init__(*args, **kwargs)
        self.fields['question1'].label = "CoastalDefender is a game."
        self.fields['question2'].label = 'Google Maps or a similar Earth browser (like Bing maps) is a sutible platform for this kind of application.'
        self.fields['question3'].label = 'Coastal Defender has made me more inclined to learn about coastal managment and flooding.'
        self.fields['question4'].label = 'I often share information and opinions about about scientific and environmental issues on my social media networks.'
        self.fields['question5'].label = 'Communities affected by coastal flooding can use a tool like CoastalDefender to assist with engagement a given issue.'
        self.fields['question6'].label = 'Did you share information about the game through the Tweet button or other social media?'
        self.fields['question7'].label = 'Your age range'
        self.fields['question8'].label = 'Your gender'
    class Meta:
        model = questionaire
        fields = ('gameId', 'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8',)


