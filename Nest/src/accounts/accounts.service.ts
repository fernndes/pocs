import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { AccountTypesEntity } from './entities/account-types.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccountTypesEntity)
    private accountTypesRepository: Repository<AccountTypesEntity>,
  ) {}

  create(createAccountDto: CreateAccountDto) {
    return this.accountRepository.save(createAccountDto);
  }

  private async getAccountInfo(userId: number) {
    return await this.accountRepository.createQueryBuilder("account")
    .leftJoinAndSelect("account.user", "user")
    .leftJoinAndSelect("account.accountType", "accountType")
    .where("user.id = :userId", { userId })
    .getOne()
}

  async findOne(id: number) {
    return await this.getAccountInfo(id)
  }

  createAccountType(createAccountType: CreateAccountTypeDto) {
    return this.accountTypesRepository.save(createAccountType);
  }
}
