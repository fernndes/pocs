import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(AccountEntity)
        private accountRepository: Repository<AccountEntity>
      ) {}

    private create(createTransactionDto: CreateTransactionDto) {
        return this.transactionRepository.save(createTransactionDto);
    }

    getAll() {
        return this.transactionRepository.find({ relations: { receiver: true, sender: true } })
    }

    private async getAccountInfo(accountId: AccountEntity) {
        return await this.accountRepository.createQueryBuilder("account")
            .leftJoinAndSelect("account.user", "user")
            .leftJoinAndSelect("account.accountType", "accountType")
            .where("account.id = :accountId", { accountId })
            .getOne()
    }

    async transfer({ sender: senderId, receiver: receiverId, value: amount }: CreateTransactionDto) {
        const sender: any = await this.getAccountInfo(senderId)
        const receiver: any = await this.getAccountInfo(receiverId)

        if(sender?.balance > 0) {
            if(sender?.accountType?.permissions?.indexOf('send') !== -1) {
                if(receiver?.accountType?.permissions?.indexOf('receive') !== -1) {
                    try {
                        return this.create({
                            receiver: receiver?.id,
                            sender: sender?.id,
                            value: amount,
                        })
                    } catch (error) {
                        throw new Error("Erro na transferência")
                    }
                } else {
                    throw new Error("O usuário não tem permissão para receber transferências")
                }                
            } else {
                throw new Error("O usuário não tem permissão para realizar transferências")
            }           
        } else {
            throw new Error("Usuário sem saldo para transferencia")
        }
    }
}
