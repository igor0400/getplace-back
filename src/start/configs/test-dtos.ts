import { CreatePlaceDto } from 'src/places/dto/create-place.dto';
import { CreateTableReservationUserSeatDto } from 'src/reservations/dto/create-reservation-user-seat.dto';
import { CreateReservationDto } from 'src/reservations/dto/create-reservation.dto';
import { CreateRestaurantDishDto } from 'src/restaurants/dto/create-dish.dto';
import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';
import { CreateSeatDto } from 'src/seats/dto/create-seat.dto';
import { CreateTableDto } from 'src/tables/dto/create-table.dto';

const hour = 1000 * 60 * 60;

export default {
  place: (employeeId: string): CreatePlaceDto => ({
    employeeId,
    title: 'Greel',
    description: 'Ресторан быстрого питания',
    type: 'restaurant',
    category: 'fastfood',
    price: '300',
    color: '#000000',
    workDaysFrom: 'Понедельник',
    workDaysTill: 'Воскресенье',
    workTimeFrom: '10:00',
    workTimeTill: '22:00',
    address: 'Italia, Catanzaro, Contrada Neri 1',
    contactPhone1: '+79114063377',
  }),
  room: (placeId: string): CreateRoomDto => ({
    title: 'Обычный',
    placeId,
    maxPositionsX: 6,
    maxPositionsY: 5,
  }),
  table: (placeId: string, roomId: string): CreateTableDto => ({
    placeId,
    roomId,
    positionX: 3,
    positionY: 3,
    number: '20C',
  }),
  seat: (placeId: string, tableId: string): CreateSeatDto => ({
    placeId,
    tableId,
    number: '3',
  }),
  reservation: (
    userId: string,
    tableId: string,
    startDate?: Date,
    endDate?: Date,
  ): CreateReservationDto => {
    const exampleStartDate = new Date(
      Date.parse(new Date().toString()) + hour * 24 * 10,
    );
    const exampleEndDate = new Date(
      Date.parse(new Date().toString()) + hour * 24 * 10 + hour,
    );

    exampleStartDate.setUTCHours(12, 0, 0, 0);
    exampleEndDate.setUTCHours(13, 0, 0, 0);

    return {
      userId,
      tableId,
      startDate: startDate ?? exampleStartDate,
      endDate: endDate ?? exampleEndDate,
    };
  },
  reservationUserSeat: (
    userId: string,
    reservationId: string,
    reservationUserId: string,
    seatId: string,
  ): CreateTableReservationUserSeatDto => ({
    userId,
    reservationId,
    reservationUserId,
    seatId,
  }),
  placeDish: (placeId: string): CreateRestaurantDishDto => ({
    placeId,
    title: 'Бургер',
    description: 'Огромный бургер',
    catigory: 'Фастфуд',
    type: 'food',
    cost: '400',
    position: '1',
    weight: '800',
  }),
};
