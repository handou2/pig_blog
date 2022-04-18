import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn  } from 'typeorm';
import { User } from './user'
@Entity({name: 'articles'})
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  //有多少人看过文章
  views!: null;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  @Column()
  is_delete!: number;

  @ManyToOne(()=>User)
  @JoinColumn({name: 'user_id'})
  user!: User

}