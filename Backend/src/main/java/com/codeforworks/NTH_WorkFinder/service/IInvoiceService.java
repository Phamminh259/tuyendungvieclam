package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.invoice.InvoiceResponseDTO;
import java.util.List;

public interface IInvoiceService {
    InvoiceResponseDTO getInvoiceById(Long id);
    InvoiceResponseDTO getInvoiceBySubscriptionId(Long subscriptionId);
    List<InvoiceResponseDTO> getAllInvoices();
    List<InvoiceResponseDTO> getInvoicesByEmployerId(Long employerId);
    List<InvoiceResponseDTO> getInvoicesByStatus(String status);
    void cancelInvoice(Long id);
} 