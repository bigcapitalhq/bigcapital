import { Vendor } from '@/models';


export default class VendorsService {


  static async isVendorExists(vendorId) {
    const foundVendors = await Vendor.tenant().query().where('id', vendorId);
    return foundVendors.length > 0;
  }

  static async isVendorsExist(vendorsIds) {
    
  }
}