import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Ruchin Munjal',
      email: 'tf@tf.com',
      role: 'ENGINEER',
    },
    {
      id: 2,
      name: 'Shray Munjal',
      email: 'why@wtf.com',
      role: 'ADMIN',
    },
    {
      id: 3,
      name: 'Parul Munjal',
      email: 'dontcare@crazy.com',
      role: 'ENGINEER',
    },
    {
      id: 4,
      name: 'Mia Munjal',
      email: 'adorbs@awesome.com',
      role: 'INTERN',
    },
  ];

  findAll(role?: 'INTERN' | 'ADMIN' | 'ENGINEER') {
    if (role) {
      const users = this.users.filter((user) => user.role == role);
      if(!users.length) throw new NotFoundException(`No Users with found with role ${role}`)
      return users;
    }
    return this.users;
  }

  findOne(id: number) {

    const user = this.users.filter((u) => u.id == id)[0];
    if(!user) throw new NotFoundException("User Not Found");
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const userByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: userByHighestId[0].id + 1,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id == id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });
    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id != id);
    return removedUser;
  }
}
