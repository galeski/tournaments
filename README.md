This application can be used to organize work tournaments (for example football
scoring matches).

WIP - this repo is a work in progress

TODO:

Fix the navbar after logon

Logon/register curl example
curl -X POST http://localhost:5050/auth/login \   
     -H "Content-Type: application/json" \
     -d '{"username":"testuser1", "password":"testpassword1"}'

Example:
John wants to play "Guess the score" for EURO tournament.
He creates an table and/or excel sheet for players
to put their guesses in.

1. Issues:
    He needs to manually enter the results if done
    by e-mail tables.
    He wants all the players to make guesses on their own,
    but the excel file doesn't allow that - you can
    see what other players put into the excel sheet.
2. App solution:
    We created a list of questions with:
    a) dual answer (Yes, no)
    b) multiple numeric values (ie. -MaxInt to +MaxInt)
    c) string (including answers like "0:1")

    We need to have:
    - a db - mongodb? (how much traffic possible?), duck
      db as a local alternative?)
    - backend - nodejs
    - frontend

3. General idea of work
    We create a tournament. Let's say "EURO SCORING". 
    I'm Mateusz. I create the tournament:

    0. Put in the number of players or open to all.

    1. Title #1 ie. question
        1.2 - Subquestions, ie. "Poland:Germany"

    tournament = {
        "id": id
        "title": "What is the score for 1 round of EURO tournament?",
        "subqs": ["Poland:Germany", "Sweden:Ireland"],
    }

    answer = {
        "tournamentId": id,
        "user": "Tomasz Kowalski",
        "answer": ["1:0", "0:1"]
    }

    userdata = {
        "username": "tkowalski",
        "userdesc": "Tomasz Kowalski",
        "tournaments": [id list]
    }

4. Backend

    4.1 Return hash with tournament number
    4.2 Return main question and list of questions from db
    4.3 ? Access user profile ?

5. Frontend
    
    View:
    
    IF COMING FOR THE FIRST TIME
    ASK WHAT USER NAME HE WANTS
    (this is for non-logon users)
        
            "WHAT IS THE SCORE"

            "1. QUESTION"           ANSWER
            "2. QUESTION"           ANSWER

                            [Submit]

            After the tournament:
            
                Just a message that:
            ADAM KOWALSKI WON!


    Login/create account (only for admins)
            
            JWT ? or User google logon...
    
    
6. OPEN QUESTIONS

    1. How to do the timing part, for example if we need to have rounds like in EURO...
