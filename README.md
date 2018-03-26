# Ryde

[Ryde](https://aqueous-springs-25736.herokuapp.com/) is a web app for organizing and joining carpools. It was created for Project 3 at General Assembly, WDI-17 and is hosted on Heroku at:

https://aqueous-springs-25736.herokuapp.com/

### Jump to...

- [Technologies Used](https://github.com/ScoRoc/Ryde#technologies-used)
- [Routes](https://github.com/ScoRoc/Ryde#routes)
- [Models](https://github.com/ScoRoc/Ryde#models)
- [APIs Used](https://github.com/ScoRoc/Ryde#apis-used)
- [User Stories](https://github.com/ScoRoc/Ryde#user-stories)
- [About the project](https://github.com/ScoRoc/Ryde#about-the-project)
- [Wireframes](https://github.com/ScoRoc/Ryde#wireframes)
- [Next Steps](https://github.com/ScoRoc/Ryde#next-steps)

Ryde Homepage
![Ryde homepage](/readme-images/finished_homepage.png)

---
## Technologies Used
[to the top](https://github.com/ScoRoc/Ryde#ryde)

- HTML5 / CSS3
- JavaScript
- Materialize
- Node.js
- Express
- BCrypt
- Passport
- Session
- MongoDB
- Mongoose

## Routes
[to the top](https://github.com/ScoRoc/Ryde#ryde)

| CRUD   | ROUTE                           | FUNCTIONALITY
|--------|---------------------------------|--------------
| GET    | /                               | Home page.
| POST   | /auth/signup                    | Sign up.
| POST   | /auth/login                     | Log in.
| POST   | /auth/me/from/token                  | Lift login from token.
| POST   | /ryde                           | Post a dryve.
| GET    | /ryde/:id/edit                  | Load a dryve into edit form.
| PUT    | /ryde/:id                       | Submit dryve edits.
| PUT    | /ryde/delete                    | Delete a dryve.
| PUT    | /ryde/complete                  | Complete a dryve.
| POST   | /mydryves                       | Approve/deny ryders for a dryve.
| GET    | /mydryves/:id                   | Get logged in user's dryves.
| POST   | /ryders/confirmed               | Load confirmed ryders for a dryve.
| POST   | /ryders/pending                 | Load pending ryders for a dryve.
| PUT    | /myrydes                        | Request to join ryde.
| GET    | /myrydes/:id                    | Get logged in user's rydes.
| GET    | /profile/:id                    | Load public profile.
| POST   | /profile/:id/reviewuser         | Submit review for other user.
| PUT    | /profile/:id/removedryverstatus | Delete dryver details.
| PUT    | /profile/:id/becomedryver       | Submit dryver details.
| PUT    | /profile/:id/edit               | Submit changes from private profile page.
| DELETE | /profile/:id                    | Delete proile
| POST   | /bigsearch                      | Full ryde search.
| POST   | /minisearch                     | Limited ryde search.



## Models
[to the top](https://github.com/ScoRoc/Ryde#ryde)

#### User

- name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 99
  }

- email: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 99
  },

- password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 99
  },

- homeAddress: {
    street: String,
    - city: {
      type: String,
      required: true
    },

-  state: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 2
    },
    - zip: Number
  },

- workAddress: {
    - street: String,
    - city: {
      type: String,
    },
    - state: {
      type: String,
      minLength: 2,
      maxLength: 2
    },
    - zip: Number
  },

- dob: {
    type: String,
    required: true
  },

- dryver: {
    type:Boolean,
    default: false,
  },

- car: String,
- license: String,
- dryverRatings: Array,
- dryverRatingAvg: Number,
- dryverReviews: Array,
- ryderRatings: Array,
- ryderRatingAvg: Number,
- ryderReviews: Array,
- reviewedDryvers: Array,
- reviewedRyders: Array,
- setTrips: Array,
- pendingTrips: Array,
- deniedTrips: Array,
- completedTrips: {
    type:Array,
    default:[]
  },
- deletedDryves: {
    type:Array,
    default:[]
  },
- completedDryves: Array,
- image: String,
- trips: [{ type: Schema.Types.ObjectId, ref: 'Trips' }]
})

#### Trip
- driverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
- rydeName: {
    type: String,
    required: true
  },
- startAddress: {
    - street: String,
    - city: {
      type: String,
      required: true
    },
    - state: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 2
    },
    - zip: Number
  },
- endAddress: {
    - street: String,
    - city: {
      type: String,
      required: true
    },
    - state: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 2
    },
    - zip: Number
  },
- departDate: {
    type: Number,
    required: true
  },
- reoccurring: {
    type: Boolean,
    required: true
  },
- reoccurringDays: Array,
  - cost: {
    type: Number,
    required: true
  },
- costBreakdown: String,
- smoking: Boolean,
- pets: Boolean,
- carType: {
    type: String,
    required: true
  },
- seats: {
    type: Number,
    required: true
  },
- comments: Array,
- ridersId: Array,
- pendingRiders: Array,
- deniedRiders: Array,
- completed: {
    type:Boolean,
    default: false},
- deleted: {
    type:Boolean,
    default: false
  }

## APIs Used
[to the top](https://github.com/ScoRoc/Ryde#ryde)
- [Avatar API](https://www.avatarapi.com)

## User Stories
[to the top](https://github.com/ScoRoc/Ryde#ryde)

1. As a daily commuter, I'd prefer to carpool over taking public transportation or driving my own car to work every day. Commuting is cheaper, more pleasant than riding the bus, and is better for the environment.
2. My friends and I are going to a music festival, but none of us have a car! We'd love to carpool
if someone else going has a few extra seats.
3. I'm looking for something to do this weekend, and want to find trips that are leaving from my area. Maybe I'll make some new friends on the way!

## About the project
[to the top](https://github.com/ScoRoc/Ryde#ryde)

Ryde was originally inspired by the traffic and difficult commutes prevalent in Seattle. Organizing carpools at scale could reduce the number of cars on the road, helping to clear room and reduce travel times at peak hours.

Once we started thinking about it, however, we realized that the opportunity for Ryde was even larger than daily commutes. Carpooling can help save money and provide access in a number of situations, including remote weekend activities (like skiing), traveling to popular destinations (Sasquatch music festival), and more.

## Wireframes
[to the top](https://github.com/ScoRoc/Ryde#ryde)

![Landing page wireframe](readme-images/1.jpg)
![List search](readme-images/2.jpg)
![Expandable result card](readme-images/3.jpg)
![Login and signup](readme-images/4.jpg)


## Next Steps
[to the top](https://github.com/ScoRoc/Ryde#ryde)

- Improve ReadMe.md
- Add payments API integration
- Improve security
- Clean and standardize code.
- Consolidate BigSearch and MiniSearch server routes.
