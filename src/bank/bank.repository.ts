import { EntityRepository, Repository } from "typeorm";
import { Bank } from "./bank.entity";

@EntityRepository(Bank)
export class UserRepository extends Repository<Bank> {

}