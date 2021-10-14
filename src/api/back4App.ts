import Parse from 'parse';
import { Address } from '../models/melino/address';
import { DesiredItem } from '../models/melino/desiredItem';
import { Neighbour } from './../models/melino/neighbour';

type ClassInstance =
  | {
      className: 'Address';
      attributes: Address;
    }
  | {
      className: 'Neighbour';
      attributes: Neighbour;
    }
  | {
      className: 'DesiredItem';
      attributes: DesiredItem;
    };

async function getRelationAtributes<FromClass, ToClass>(
  queryResult: Parse.Object<FromClass>,
  relation: 'addresses' | 'desiredItems'
): Promise<ToClass[]> {
  return (
    await queryResult
      .relation(relation as never)
      .query()
      .find()
  ).map((a) => ({ ...a.attributes, objectId: a.id } as any));
}

async function getNeighbourFromMeliId(
  meliUserId: number
): Promise<Neighbour | null> {
  let parseQuery: Parse.Query<Parse.Object<Neighbour>> = new Parse.Query<
    Parse.Object<Neighbour>
  >('Neighbour');
  parseQuery.equalTo('meliUserId', meliUserId);
  parseQuery.include('addresses');
  try {
    let queryResult = await parseQuery.first();
    if (!queryResult) {
      return null;
    }
    const addresses = await getRelationAtributes<Neighbour, Address>(
      queryResult,
      'addresses'
    );
    const desiredItems = await getRelationAtributes<Neighbour, DesiredItem>(
      queryResult,
      'desiredItems'
    );
    return Promise.resolve({
      ...queryResult.attributes,
      objectId: queryResult.id,
      addresses,
      desiredItems,
    });
  } catch (error: any) {
    return Promise.reject(error);
  }
}

/**
 * Agrega una lista de direcciones a un Neighbour
 * @param objectId - Id del Neighbour
 * @param addresses - Lista de Direcciones
 * @returns
 */

/**
 * Actualiza un Neighbour
 * @param neighbourData - Objeto con los datos a actualizar. Los Address y DesiredItems que no tengan objectId se agregan como nuevos. El parametro neighbourData.objectId debe estar seteado para identificar al Neighbour. El atributo meliId no se puede modificar.
 * @returns
 */
async function updateNeighbour(
  neighbourData: Neighbour
): Promise<Neighbour | null> {
  let parseQuery = new Parse.Query<Parse.Object<Neighbour>>('Neighbour');
  try {
    const queryResult: Parse.Object = await parseQuery.get(
      neighbourData.objectId!
    );
    if (!queryResult) {
      return Promise.reject('No se encontró el Neighbour');
    }

    const newAddresses = neighbourData.addresses?.filter((a) => !a.objectId);
    const newDesiredItems = neighbourData.desiredItems?.filter(
      (a) => !a.objectId
    );
    queryResult.set('importAddresses', neighbourData.importAddresses);

    /* Si hay, agrega direcciones */
    if (newAddresses && newAddresses.length > 0) {
      const relation = queryResult.relation('addresses');
      for (let index = 0; index < newAddresses.length; index++) {
        const element = newAddresses[index];
        const newAddress = await createParseObject({
          className: 'Address',
          attributes: element,
        });
        relation.add(newAddress);
      }
    }

    /* Si hay, agrega items */
    if (newDesiredItems && newDesiredItems.length > 0) {
      const relation = queryResult.relation('desiredItems');
      for (let index = 0; index < newDesiredItems.length; index++) {
        const element = newDesiredItems[index];
        const newDesired = await createParseObject({
          className: 'DesiredItem',
          attributes: element,
        });
        relation.add(newDesired);
      }
    }

    queryResult.save();
    return Promise.resolve({
      ...(queryResult.attributes as Neighbour),
    });
  } catch (error: any) {
    return Promise.reject(error);
  }
}

async function addDesiredItem(objectId: string, desiredItem: DesiredItem) {
  let neighbourQuery = new Parse.Query<Parse.Object<Neighbour>>('Neighbour');
  try {
    const neighbourResult: Parse.Object = await neighbourQuery.get(objectId);
    if (!neighbourResult) {
      return Promise.reject('No se encontró el Neighbour');
    }
    const newDesired = (await createParseObject({
      className: 'DesiredItem',
      attributes: desiredItem,
    })) as Parse.Object<DesiredItem>;
    const diRelation = neighbourResult.relation('desiredItems');
    diRelation.add(newDesired);
    neighbourResult.save();
    return Promise.resolve({
      ...(newDesired.attributes as DesiredItem),
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Create a new Parse Object
 * @param newObject - Objeto a crear
 * @returns
 */
async function createParseObject(newObject: ClassInstance) {
  const myNewObject: Parse.Object<typeof newObject.attributes> =
    new Parse.Object<typeof newObject.attributes>(
      newObject.className,
      newObject.attributes
    );
  try {
    const result: Parse.Object<typeof newObject.attributes> =
      await myNewObject.save();
    return Promise.resolve<Parse.Object<typeof newObject.attributes>>(result);
  } catch (error: any) {
    return Promise.reject(error);
  }
}

/**
 * Create a new Parse Object
 * @param newObject - Objeto a crear
 * @returns
 */
async function deleteParseObject(delObj: {
  objectId: string;
  className: 'Neighbour' | 'Address' | 'DesiredItem';
}) {
  let objQuery = new Parse.Query(delObj.className);
  try {
    const delObject: Parse.Object = await objQuery.get(delObj.objectId);
    if (!delObject) {
      return Promise.reject(`No se encontró el ${delObj.className}`);
    }
    const result: Parse.Object = await delObject.destroy();
    return Promise.resolve(result);
  } catch (error: any) {
    return Promise.reject(error);
  }
}

export {
  getNeighbourFromMeliId,
  createParseObject,
  updateNeighbour,
  addDesiredItem,
  deleteParseObject,
};
