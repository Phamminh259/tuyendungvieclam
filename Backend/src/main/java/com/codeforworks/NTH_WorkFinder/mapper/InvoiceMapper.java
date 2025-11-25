package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.invoice.InvoiceResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Invoice;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    @Mapping(source = "subscription.id", target = "subscriptionId")
    InvoiceResponseDTO toDTO(Invoice invoice);
} 