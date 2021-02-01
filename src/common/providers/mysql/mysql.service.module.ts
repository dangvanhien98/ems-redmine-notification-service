import { Module } from "@nestjs/common";
import { MySqlService } from "./mysql.service"
@Module({
  providers: [
    MySqlService,
  ],
  imports: [/**If use logger please import */],
  exports: [
    MySqlService,
  ],
})
export class MySqlServiceModule { }
