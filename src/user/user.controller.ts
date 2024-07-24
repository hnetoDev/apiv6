import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/config/multer.configU';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  @UseInterceptors(FileInterceptor('img',multerOptions))
  create(@Body() createUserDto: CreateUserDto,@UploadedFile() file: Express.Multer.File) {
    console.log(createUserDto)
    return this.userService.create(createUserDto,file);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post('search')
  search(@Body('active') status: boolean | undefined, @Body('search') search: string){
    console.log(status,search)
    return this.userService.search(search,status)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('img',multerOptions))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@UploadedFile() file: Express.Multer.File) {
    return this.userService.update(id, updateUserDto,file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
