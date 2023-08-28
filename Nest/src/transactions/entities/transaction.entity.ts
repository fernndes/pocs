import { AccountEntity } from 'src/accounts/entities/account.entity';
import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm'

@Entity()
export class TransactionEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    value: number;

    @ManyToOne(() => AccountEntity, account => account.id) @JoinColumn()
    sender: AccountEntity;

    @ManyToOne(() => AccountEntity, account => account.id) @JoinColumn()
    receiver: AccountEntity;
}