import {User} from '../models/User';
export const Data: User[] = [

  {
    name: { firstname: 'Áron', lastname: 'Bármi' },
    email: 'barmiaron@gmail.com',
    password: 'jelszo',
    bookings: [
      {
        laneNumb: 2,
        startTime: new Date('2025-04-15T14:00:00'),
        endTime: new Date('2025-04-15T15:00:00'),
        numberOfPlayers: 3,
        price: 4500
      },
      {
        laneNumb: 1,
        startTime: new Date('2025-04-10T16:00:00'),
        endTime: new Date('2025-04-10T17:00:00'),
        numberOfPlayers: 2,
        price: 4000
      },
      {
        laneNumb: 3,
        startTime: new Date('2025-04-20T11:00:00'),
        endTime: new Date('2025-04-20T12:00:00'),
        numberOfPlayers: 4,
        price: 6000
      },
      {
        laneNumb: 2,
        startTime: new Date('2025-04-25T18:00:00'),
        endTime: new Date('2025-04-25T19:00:00'),
        numberOfPlayers: 6,
        price: 9000
      },
      {
        laneNumb: 1,
        startTime: new Date('2025-04-30T10:00:00'),
        endTime: new Date('2025-04-30T11:00:00'),
        numberOfPlayers: 1,
        price: 3000
      },
      {
        laneNumb: 3,
        startTime: new Date('2025-05-01T20:00:00'),
        endTime: new Date('2025-05-01T21:00:00'),
        numberOfPlayers: 5,
        price: 7500
      }
    ]
  },
];
