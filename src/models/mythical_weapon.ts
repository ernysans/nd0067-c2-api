import Client from '../database';

export type MythicalWeapon = {
    id?: number;
    name: string;
    type: string;
    weight: number;
};

export class MythicalWeaponStore {
    async index(): Promise<MythicalWeapon[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM mythical_weapons';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get mythical weapons. Error: ${err}`);
        }
    }

    async show(id: string): Promise<MythicalWeapon> {
        try {
            const sql = 'SELECT * FROM mythical_weapons WHERE id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find mythical weapon ${id}. Error: ${err}`);
        }
    }

    async create(mw: MythicalWeapon): Promise<MythicalWeapon> {
        try {
            const sql = 'INSERT INTO mythical_weapons (name, type, weight) VALUES($1, $2, $3) RETURNING *';
            const values: any[] = [mw.name, mw.type, mw.weight];
            const conn = await Client.connect();
            const result = await conn.query(sql, values);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add new mythical weapon. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<MythicalWeapon> {
        try {
            const sql = 'DELETE FROM mythical_weapons WHERE id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete mythical weapon ${id}. Error: ${err}`);
        }
    }
}
