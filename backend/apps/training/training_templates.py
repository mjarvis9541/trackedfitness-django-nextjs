from .models import Exercise, Movement, Set, Workout

# routine template - collection of workouts
routine = [
    {
        # workout template - collection of exercises
        "chest_day_template": [
            # Exercise template
            {"movement": "Flat Barbell Bench Press", "sets": 4, "weight": 0},
            # Exercise template
            {"movement": "Incline Barbell Bench Press", "sets": 4, "weight": 0},
            # Exercise template
            {"movement": "Machine Fly", "sets": 4, "weight": 0},
            # Exercise template
            {"movement": "Chest Dip", "sets": 4, "weight": 0},
            # Exercise template
            {"movement": "Captain's Chair Leg Raise", "sets": 4, "weight": 0},
        ]
    },
    {
        # workout template
        "back_day_template": [
            # Exercise template
            {"movement": "Barbell Deadlift", "sets": 4, "weight": 0},
            # exercise template
            {"movement": "Wide-Grip Pulldwn", "sets": 4, "weight": 0},
            # Exercise template
            {"movement": "Machine Row", "sets": 4, "weight": 0},
            # Exercise template
            {"movement": "Chest Dip", "sets": 4, "weight": 0},
            # Exercise template
            {"movement": "Captain's Chair Leg Raise", "sets": 4, "weight": 0},
        ]
    },
]

chest_day_template = [
    {"movement": "Flat Barbell Bench Press", "sets": 4, "weight": 75},
    {"movement": "Incline Barbell Bench Press", "sets": 4, "weight": 75},
    {"movement": "Machine Fly", "sets": 4, "weight": 80},
    {"movement": "Chest Dip", "sets": 4, "weight": 85},
    {"movement": "Captain's Chair Leg Raise", "sets": 4, "weight": 0},
]

back_day_template = [
    # Exercise
    {"movement": "Barbell Deadlift", "sets": 4, "weight": 0},
    {"movement": "Wide-Grip Pulldown", "sets": 4, "weight": 0},
    {"movement": "Machine Row", "sets": 4, "weight": 0},
    {"movement": "Close-Grip Pulldown", "sets": 4, "weight": 0},
    {"movement": "Standing Calf Raise", "sets": 4, "weight": 0},
]


def create_workout(user_id, date, session_template):
    # 1. Create a session
    session = Workout(user_id=user_id, date=date)
    session.save()
    session.refresh_from_db

    # 2. Create an exercise for each movement in movement id list:
    for obj in session_template:
        movement = Movement.objects.get(name=obj["movement"])
        set_count = obj["sets"]
        weight = obj["weight"]
        exercise = Exercise(session=session, movement=movement)
        exercise.save()
        exercise.refresh_from_db()
        number = 0
        for x in range(number, set_count):
            number += 1
            Set.objects.create(
                exercise=exercise,
                number=number,
                weight=weight,
                reps=0,
            )
    return "workout created"


create_workout(user_id=1, date="2021-09-18", session_template=chest_day_template)
create_workout(user_id=1, date="2021-09-19", session_template=back_day_template)
create_workout(user_id=1, date="2021-09-20", session_template=back_day_template)
create_workout(user_id=1, date="2021-09-21", session_template=chest_day_template)


def create_exercises_for_session(session_id, movement_id_list, sets_per_exercise):

    for movement_id in movement_id_list:
        exercise = Exercise(session_id=session_id, movement_id=movement_id)
        exercise.save()
        exercise.refresh_from_db()

        number = 0
        for x in range(number, sets_per_exercise):
            number += 1
            Set.objects.create(
                exercise=exercise,
                number=number,
                weight=100,
                reps=0,
            )
    return
