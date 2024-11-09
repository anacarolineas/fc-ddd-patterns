import CustomerService from "./customer.service";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import SendConsoleLog1Handler from "../event/handler/send-consolelog1.handler";
import SendConsoleLog2Handler from "../event/handler/send-consolelog2.handler";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import { Sequelize } from "sequelize-typescript";
import Address from "../value-object/address";
import SendConsoleLogHandler from "../event/handler/send-consolelog.handler";

describe("Costumer service unit tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([CustomerModel]);
      await sequelize.sync();
    });
    
    it("should created customer event emited", async () => {
        const dispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog1Handler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const eventHandler2 = new SendConsoleLog2Handler();
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        dispatcher.register('CustomerCreatedEvent', eventHandler)
        dispatcher.register('CustomerCreatedEvent', eventHandler2)

        const repository = new CustomerRepository();
        
        const customerService  = new CustomerService(dispatcher, repository);
        
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");

        await customerService.create("Ana", address);

        expect(spyEventHandler).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should update adress customer event emited", async () => {
        const dispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        dispatcher.register('CustomerAdressChangedEvent', eventHandler)

        const repository = new CustomerRepository();
        
        const customerService  = new CustomerService(dispatcher, repository);
        
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        const customer = await customerService.create("Ana", address);

        customer.changeAddress(new Address("Street 2", 55, "13330-250", "São Paulo"));

        await customerService.update(customer);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should not update adress customer event not emited", async () => {
        const dispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        dispatcher.register('CustomerAdressChangedEvent', eventHandler)

        const repository = new CustomerRepository();
        
        const customerService  = new CustomerService(dispatcher, repository);
        
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        const customer = await customerService.create("Ana", address);

        await customerService.update(customer);

        expect(spyEventHandler).toBeCalledTimes(0);
    });
});