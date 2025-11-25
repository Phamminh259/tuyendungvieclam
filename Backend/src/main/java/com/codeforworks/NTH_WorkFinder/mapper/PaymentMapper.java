package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.payment.PaymentHistoryDTO;
import com.codeforworks.NTH_WorkFinder.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(source = "invoice.id", target = "invoiceId")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    PaymentHistoryDTO toPaymentHistoryDTO(Payment payment);
} 