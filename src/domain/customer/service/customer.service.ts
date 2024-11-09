import CustomerCreatedEvent from "../event/customer-created.event";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import CustomerRepositoryInterface from "../repository/customer-repository.interface";
import Customer from "../entity/customer";
import { v4 as uuidv4 } from 'uuid';
import Address from "../value-object/address";
import CustomerAdressChangedEvent from "../event/customer-adress-changed.event";
import CustomerFactory from "../factory/customer.factory";

export default class CustomerService {
    
    constructor(
        private readonly dispatcher: EventDispatcherInterface,
        private readonly repository: CustomerRepositoryInterface) {
    }
    async create(name: string, address: Address) {
        const customer = CustomerFactory.createWithAddress(name, address);
        await this.repository.create(customer);
        
        const customerCreatedEvent = new CustomerCreatedEvent(customer);
        this.dispatcher.notify(customerCreatedEvent);

        return customer;
    }
    
    async update(customer: Customer) {
        const customerFounded = await this.repository.find(customer.id);
                
        customer.changeName(customer.name);
        
        if (JSON.stringify(customer.Address) != JSON.stringify(customerFounded.Address)) {
            customer.changeAddress(customer.Address);

            const customerAdressChangedEvent = new CustomerAdressChangedEvent(customer);
            this.dispatcher.notify(customerAdressChangedEvent);
        }
        
        await this.repository.update(customer)
    }
}