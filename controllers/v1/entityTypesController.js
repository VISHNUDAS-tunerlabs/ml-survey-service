const entitiyTypesHelper = require(ROOT_PATH + "/module/entityTypes/helper")
const entitiesHelper = require(ROOT_PATH + "/module/entities/helper")

module.exports = class EntityTypes extends Abstract {
  constructor() {
    super(entityTypesSchema);
  }

  static get name() {
    return "entityTypes";
  }


  /**
  * @api {get} /assessment/api/v1/entityTypes/canBeObserved Entity Type list
  * @apiVersion 0.0.1
  * @apiName Entity Type Observable list
  * @apiGroup Entity Types
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/entityTypes/canBeObserved
  * @apiUse successBody
  * @apiUse errorBody
  */

  canBeObserved() {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await entitiyTypesHelper.list({isObservable:true},{name :1});

        return resolve({
          message: "Entity type fetched successfully.",
          result: result
        });

      } catch (error) {

        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }


    })
  }


  /**
  * @api {get} /assessment/api/v1/entityTypes/createGroupEntityTypeIndex Create groups.entityType index
  * @apiVersion 0.0.1
  * @apiName Create groups.entityType index
  * @apiGroup Entity Types
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/entityTypes/createGroupEntityTypeIndex
  * @apiUse successBody
  * @apiUse errorBody
  */

  createGroupEntityTypeIndex() {
    return new Promise(async (resolve, reject) => {

      try {

        const result = await entitiyTypesHelper.list({},{name :1});
        
        let indexResult = await Promise.all(result.map(async entityType => {
          const indexCreation = await entitiesHelper.createGroupEntityTypeIndex(entityType.name)
          return "Index successfully created for entity type - "+entityType.name
        }))

        if (
          indexResult.findIndex(
            index => index === undefined || index === null
          ) >= 0
        ) {
          throw "Something went wrong, entity group index was not created.";
        }

        return resolve({
          message: "Entity type index created successfully.",
          result: indexResult
        });

      } catch (error) {

        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }


    })
  }

};
