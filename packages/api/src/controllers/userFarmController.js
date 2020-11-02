/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (userFarmController.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

const baseController = require('../controllers/baseController');
const userFarmModel = require('../models/userFarmModel');
const userModel = require('../models/userModel');
const farmModel = require('../models/farmModel');
const emailTokenModel = require('../models/emailTokenModel');
const createUserController = require('../controllers/createUserController');
const userFarmStatusEnum = require('../common/enums/userFarmStatus');
const {transaction, Model} = require('objection');
const axios = require('axios');
const authExtensionConfig = require('../authExtensionConfig');
const knex = Model.knex();
const lodash = require('lodash');
const url = require('url');
const generator = require('generate-password');
const emailSender = require('../templates/sendEmailTemplate');
const { v4: uuidv4 } = require('uuid');

const validStatusChanges = {
  "Active": ["Inactive"],
  "Inactive": ["Active"],
  "Invited": ["Inactive", "Active"],
};

class userFarmController extends baseController {
  constructor() {
    super();
  }

  static getUserFarmByUserID() {
    return async (req, res) => {
      try {
        const user_id = req.params.user_id;
        const rows = await userFarmModel.query().select('*').where('userFarm.user_id', user_id)
          .leftJoin('role', 'userFarm.role_id', 'role.role_id')
          .leftJoin('users', 'userFarm.user_id', 'users.user_id')
          .leftJoin('farm', 'userFarm.farm_id', 'farm.farm_id');
        if (!rows.length) {
          res.sendStatus(404)
        }
        else {
          res.status(200).send(rows);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).send(error);
      }
    };
  }

  static getUserFarmsByFarmID() {
    return async (req, res) => {
      try {
        const farm_id = req.params.farm_id;
        const user_id = req.headers.user_id;
        const [userFarm] = await userFarmModel.query().select('role_id').where('farm_id', farm_id).andWhere('user_id', user_id);
        let rows;
        if (userFarm.role_id == 3) {
          rows = await userFarmModel.query().select(
            'users.first_name',
            'users.last_name',
            'users.profile_picture',
            'users.phone_number',
            'users.email',
            'userFarm.role_id',
            'role.role',
            'userFarm.status'
          ).where('userFarm.farm_id', farm_id)
            .leftJoin('role', 'userFarm.role_id', 'role.role_id')
            .leftJoin('users', 'userFarm.user_id', 'users.user_id')
        } else {
          rows = await userFarmModel.query().select('*').where('userFarm.farm_id', farm_id)
            .leftJoin('role', 'userFarm.role_id', 'role.role_id')
            .leftJoin('users', 'userFarm.user_id', 'users.user_id')
            .leftJoin('farm', 'userFarm.farm_id', 'farm.farm_id');
        }
        res.status(200).send(rows);
      }
      catch (error) {
        //handle more exceptions
        res.status(400).send(error);
      }
    };
  }

  static getActiveUserFarmsByFarmID() {
    return async (req, res) => {
      try {
        const farm_id = req.params.farm_id;
        const user_id = req.headers.user_id;
        const [userFarm] = await userFarmModel.query().select('role_id').where('farm_id', farm_id).andWhere('user_id', user_id);
        let rows;
        if (userFarm.role_id == 3) {
          rows = await userFarmModel.query().select(
            'users.first_name',
            'users.last_name',
            'users.profile_picture',
            'users.phone_number',
            'users.email',
            'userFarm.role_id',
            'role.role',
            'userFarm.status'
          ).where('userFarm.farm_id', farm_id).andWhere('userFarm.status', 'Active')
            .leftJoin('role', 'userFarm.role_id', 'role.role_id')
            .leftJoin('users', 'userFarm.user_id', 'users.user_id')
        } else {
          rows = await userFarmModel.query().select('*').where('userFarm.farm_id', farm_id).andWhere('userFarm.status', 'Active')
            .leftJoin('role', 'userFarm.role_id', 'role.role_id')
            .leftJoin('users', 'userFarm.user_id', 'users.user_id')
            .leftJoin('farm', 'userFarm.farm_id', 'farm.farm_id');
        }
        res.status(200).send(rows);
      }
      catch (error) {
        //handle more exceptions
        res.status(400).send(error);
      }
    };
  }

  static getFarmInfo() {
    return async (req, res) => {
      try {
        const user_id = req.params.user_id;
        const farm_id = req.params.farm_id;
        const rows = await userFarmModel.query().select('*').where('userFarm.user_id', user_id).andWhere('userFarm.farm_id', farm_id)
          .leftJoin('role', 'userFarm.role_id', 'role.role_id')
          .leftJoin('users', 'userFarm.user_id', 'users.user_id')
          .leftJoin('farm', 'userFarm.farm_id', 'farm.farm_id');
        res.status(200).send(rows);
      }
      catch (error) {
        //handle more exceptions
        res.status(400).send(error);
      }
    };
  }

  static addUserFarm() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const { user_id, farm_id, role } = req.body;
        let role_id = 0;

        const data = await knex.raw(
          `SELECT * FROM "role" r WHERE r.role=?`,[role]
        );

        if (data.rows && data.rows.length > 0) {
          role_id = data.rows[0].role_id;
        }

        const reqBody = { user_id, farm_id, role_id };
        const result = await baseController.postWithResponse(userFarmModel, reqBody, trx);
        await trx.commit();
        res.status(201).send(result);
      } catch (error) {
        //handle more exceptions
        await trx.rollback();
        res.status(400).send(error);
      }
    };
  }


  static async getAuthExtensionToken() {
    const { token_url, token_headers, token_body } = authExtensionConfig;
    try {
      const res = await axios({
        url: token_url,
        method: 'post',
        headers: token_headers,
        data: token_body,
      });
      if (res.status === 200) {
        if (res.data && res.data.access_token) {
          return res.data.access_token;
        }
      }
    } catch (err) {
      throw 'err: failed to get auth extension token';
    }
  }

  static getAllRolePermissions() {
    return async (req, res) => {
      try {
        const token = await this.getAuthExtensionToken();
        const { authExtensionUri } = authExtensionConfig;
        const headers = {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        };

        const permissions = {};
        const permissionsRawData = await axios({
          url: `${authExtensionUri}/api/permissions`,
          method: 'get',
          headers,
        });
        permissionsRawData.data.permissions.forEach(permission => {
          const { _id, name, description } = permission;
          permissions[_id] = { permission_id: _id, name, description };
        });

        const rolesRawData = await axios({
          url: `${authExtensionUri}/api/roles`,
          method: 'get',
          headers,
        });
        const roles = rolesRawData.data.roles.map(role => {
          const { _id, name, description, permissions: rolePermissions } = role;
          const roleData = {
            role_id: _id,
            name,
            description,
            permissions: [],
          };
          rolePermissions.forEach(rolePermissionId => {
            roleData['permissions'].push(permissions[rolePermissionId]);
          });
          return roleData;
        })
        res.status(201).send(roles);
      } catch (error) {
        res.send(error);
      }
    };
  }

  static updateConsent() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      const user_id = req.params.user_id;
      const farm_id = req.params.farm_id;

      let subject;
      let template_path;
      const has_consent = req.body.has_consent;
      const consent_version = req.body.consent_version;
      const sender = 'system@litefarm.org'

      try {

        const rows = await userFarmModel.query().select('*').where('userFarm.user_id', user_id).andWhere('userFarm.farm_id', farm_id)
          .leftJoin('role', 'userFarm.role_id', 'role.role_id')
          .leftJoin('users', 'userFarm.user_id', 'users.user_id')
          .leftJoin('farm', 'userFarm.farm_id', 'farm.farm_id');

        const isPatched = await userFarmModel.query(trx).where('user_id', user_id).andWhere('farm_id', farm_id)
          .patch({
            has_consent,
            consent_version,
          });

        const replacements = {
          first_name: rows[0].first_name,
          farm: rows[0].farm_name,
        };
        if (has_consent === false) {
          subject = 'You didn’t agree with the LiteFarm privacy policy – here are your options';
          template_path = '../templates/withheld_consent_email.html';
        }
        else {
          subject = 'You\'ve successfully joined ' + rows[0].farm_name + '!';
          template_path = '../templates/send_confirmation_email.html';
          replacements['role'] = rows[0].role
        }
        if (isPatched) {
          await trx.commit();
          res.sendStatus(200);
          //send out confirmation or withdrew consent email
          await emailSender.sendEmail(template_path, subject, replacements, rows[0].email, sender)
        }
        else {
          await trx.rollback();
          res.sendStatus(404);
        }
      }
      catch (error) {
        //handle more exceptions
        await trx.rollback();
        res.status(400).send(error);
      }
    };
  }

  static updateOnboardingFlags() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      const user_id = req.params.user_id;
      const farm_id = req.params.farm_id;

      const step_one = req.body.step_one;
      const step_one_end = req.body.step_one_end;
      const step_two = req.body.step_two;
      const step_two_end = req.body.step_two_end;
      const step_three = req.body.step_three;
      const step_three_end = req.body.step_three_end;
      const step_four = req.body.step_four;
      const step_four_end = req.body.step_four_end;
      const step_five = req.body.step_five;
      const step_five_end = req.body.step_five_end;

      try {

        const isPatched = await userFarmModel.query(trx).where('user_id', user_id).andWhere('farm_id', farm_id)
          .patch({
            step_one,
            step_one_end,
            step_two,
            step_two_end,
            step_three,
            step_three_end,
            step_four,
            step_four_end,
            step_five,
            step_five_end
          });

        if (isPatched) {
          await trx.commit();
          res.sendStatus(200);
          return;
        }
        else {
          await trx.rollback();
          res.sendStatus(404);
          return;
        }
      }
      catch (error) {
        //handle more exceptions
        await trx.rollback();
        res.status(400).send(error);
      }
    };
  }

  static updateRole() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      const farm_id = req.params.farm_id;
      const user_id = req.params.user_id;
      const { role } = req.body;
      let role_id = 0;

      const data = await knex.raw(
        `SELECT * FROM "role" r WHERE r.role=?`, [role]
      );

      if (data.rows && data.rows.length > 0) {
        role_id = data.rows[0].role_id;
      }

      if (!role_id) {
        res.status(400).send('role_id not found');
        return;
      }
      try {
        const isPatched = await userFarmModel.query(trx).where('farm_id', farm_id).andWhere('user_id', user_id)
          .patch({
            role_id,
          });
        if (isPatched) {
          const ownersManagersExtensionOfficers = await userFarmModel.query(trx)
            .where('farm_id', farm_id)
            .where(builder => builder.where('role_id', 1).orWhere('role_id', 2).orWhere('role_id', 5));
          if (ownersManagersExtensionOfficers.length == 0) {
            await trx.rollback();
            res.sendStatus(400);
            return;
          }
          await trx.commit();
          res.sendStatus(200);
          return;
        }
        else {
          await trx.rollback();
          res.sendStatus(404);
          return;
        }
      } catch (error) {
        // handle more exceptions
        await trx.rollback();
        res.status(400).send(error);
      }
    };
  }

  static updateStatus() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      const farm_id = req.params.farm_id;
      const user_id = req.params.user_id;
      const { status } = req.body;

      try {
        const targetUser = await userFarmModel.query().where('farm_id', farm_id).andWhere('user_id', user_id).first();
        let currentStatus = targetUser.status;
        if (!validStatusChanges[currentStatus].includes(status)) {
          await trx.rollback();
          res.sendStatus(400);
          return;
        }
        const isPatched = await userFarmModel.query(trx).where('farm_id', farm_id).andWhere('user_id', user_id)
          .patch({
            status,
          });
        if (isPatched) {
          await trx.commit();
          res.sendStatus(200);
          return;
        }
        else {
          await trx.rollback();
          res.sendStatus(404);
          return;
        }
      } catch (error) {
        // handle more exceptions
        await trx.rollback();
        res.status(400).send(error);
      }
    };
  }

  static updateWage() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      const farm_id = req.params.farm_id;
      const user_id = req.params.user_id;
      const { wage } = req.body;

      try {
        const isPatched = await userFarmModel.query(trx).where('farm_id', farm_id).andWhere('user_id', user_id)
          .patch({
            wage,
          });
        if (isPatched) {
          await trx.commit();
          res.sendStatus(200);
          return;
        } else {
          await trx.rollback();
          res.sendStatus(404);
          return;
        }
      } catch (error) {
        // handle more exceptions
        await trx.rollback();
        res.status(400).send(error);
      }
    };
  }

  static updateUser() {
    function removeAdditionalProperties(model, data) {
      if (Array.isArray(data)) {
        const arrayWithoutAdditionalProperties = data.map((obj) => {
          return lodash.pick(obj, Object.keys(model.jsonSchema.properties));
        });
        return arrayWithoutAdditionalProperties;
      }
      //remove all the unnecessary properties

      return lodash.pick(data, Object.keys(model.jsonSchema.properties));
    }

    async function getFarmNamebyID(farm_id) {
      try{

        const rows = await baseController.getIndividual(farmModel, farm_id)

        if(rows.length){
          return rows[0].farm_name;
        }else{
          return '404*FARM_NOT_FOUND*';
        }
      }
      catch(err){
        throw new Error(err);
      }
    }

    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      const farm_id = req.params.farm_id;
      let user_id = req.params.user_id;


      let needToConvertWorker = false;
      if (req.body && req.body.email_needs_update && req.body.email) {
        needToConvertWorker = true;
      }

      try {
        /*
          Flow of converting a user
          create a user on auth0
          update email in users table
          update user_id in users
         */
        let farm_name = await getFarmNamebyID(farm_id);
        if(farm_name === '404*FARM_NOT_FOUND*'){
          res.status(400).send('farm not found');
          return;
        }

        if (needToConvertWorker) {
          const rows = await userModel.query(trx).select('*').where('user_id', user_id);
          const replacements = {
            first_name: rows[0].first_name,
            farm: farm_name,
          };
          const subject = "You’ve been invited to join " + farm_name + " on LiteFarm!";
          const template_path = '../templates/invitation_to_farm_email.html';
          const sender = 'help@litefarm.org';
          const pw = generator.generate({
            length: 10,
            numbers: true,
            symbols: true,
          });
          const user = {
            email: req.body.email,
            password: pw,
            user_metadata: {
              first_name: rows[0].first_name,
              last_name: rows[0].last_name,
            },
            app_metadata: { emailInvite: true, signed_up: true },
            connection: 'Username-Password-Authentication',
          };

          // CHECK IF USER EMAIL ALREADY EXISTS, IF IT DOES, THEN SEND INVITE EMAIL INSTEAD
          const emails = await baseController.getByFieldId(userModel, 'email', req.body.email);

          if(emails.length && emails.length > 0){
            const existing_email = emails[0].email;
            const data = { ...req.body, status: userFarmStatusEnum.INVITED };
            await emailSender.sendEmail(template_path, subject, replacements, existing_email, sender);
            const isPatched = await userFarmModel.query(trx).where('user_id', emails[0].user_id).andWhere('farm_id', farm_id)
              .patch(removeAdditionalProperties(userFarmModel, data));

            if (isPatched) {
              await trx.commit();
              res.sendStatus(200);
            }else{
              await trx.rollback();
              res.status(500).send('add user failed');
            }
          }

          const authResponse = await createUserController.postToAuth0(user);
          let new_user_id = authResponse.data.user_id.split('|')[1];
          const url_parts = url.parse(authResponse.data.picture, true);
          const query = url_parts.query;
          let picture = query.d || '';

          await userModel.query(trx).where('user_id', user_id)
            .patch({user_id: new_user_id});

          await userModel.query(trx).where('user_id', new_user_id)
            .patch({email: req.body.email, profile_picture: picture});
          // create invite token
          let token = uuidv4();
          // gets rid of the dashes
          token = token.replace(/[-]/g, "");
          // add a row in emailToken table
          await emailTokenModel.query(trx).insert({
            user_id: new_user_id,
            farm_id: farm_id,
            token,
            is_used: false,
          });
          // the following is to determine the url
          const environment = process.env.NODE_ENV || 'development';
          let joinUrl;
          if(environment === 'integration'){
            joinUrl = `https://beta.litefarm.org/sign_up/${token}/${new_user_id}/${farm_id}/${req.body.email}/${rows[0].first_name}/${rows[0].last_name}`;
          }else if(environment === 'production'){
            joinUrl = `https://app.litefarm.org/sign_up/${token}/${new_user_id}/${farm_id}/${req.body.email}/${rows[0].first_name}/${rows[0].last_name}`;
          }else{
            joinUrl = `localhost:3000/sign_up/${token}/${new_user_id}/${farm_id}/${req.body.email}/${rows[0].first_name}/${rows[0].last_name}`
          }
          await emailSender.sendEmail(template_path, subject, replacements, req.body.email, sender, true, joinUrl);

          const data = { ...req.body, status: userFarmStatusEnum.INVITED };
          const isPatched = await userFarmModel.query(trx).where('user_id', new_user_id).andWhere('farm_id', farm_id)
            .patch(removeAdditionalProperties(userFarmModel, data));

          if (isPatched) {
            await trx.commit();
            res.sendStatus(200);
          }else{
            await trx.rollback();
            await createUserController.deleteAuth0User('auth0|' + new_user_id);
            res.status(500).send('add user failed');
          }
        }
        else{
          const isPatched = await userFarmModel.query(trx).where('user_id', user_id).andWhere('farm_id', farm_id)
            .patch(removeAdditionalProperties(userFarmModel, req.body));

          if (isPatched) {
            await trx.commit();
            res.sendStatus(200);
          }else{
            await trx.rollback();
            res.status(500).send('add user failed');
          }
        }
      } catch (error) {
        // handle more exceptions
        if (needToConvertWorker) {
          await createUserController.deleteAuth0User('auth0|' + user_id);
        }
        console.log(error);
        await trx.rollback();
        res.status(400).send(error);
      }
    }
  }

}

module.exports = userFarmController;
