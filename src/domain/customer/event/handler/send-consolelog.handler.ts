import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAdressChangedEvent from "../customer-adress-changed.event";

export default class SendConsoleLogHandler 
    implements EventHandlerInterface<CustomerAdressChangedEvent> {
    handle(event: CustomerAdressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name}
        alterado para: ${event.eventData.Address.city}`);
    }
    
}