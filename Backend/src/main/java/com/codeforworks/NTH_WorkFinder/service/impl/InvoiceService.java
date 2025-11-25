package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.invoice.InvoiceResponseDTO;
import com.codeforworks.NTH_WorkFinder.exception.InvalidOperationException;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.mapper.InvoiceMapper;
import com.codeforworks.NTH_WorkFinder.model.Invoice;
import com.codeforworks.NTH_WorkFinder.model.Invoice.InvoiceStatus;
import com.codeforworks.NTH_WorkFinder.repository.InvoiceRepository;
import com.codeforworks.NTH_WorkFinder.service.IInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InvoiceService implements IInvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    // Lấy hóa đơn theo id
    @Override
    public InvoiceResponseDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn"));
        return invoiceMapper.toDTO(invoice);
    }

    // Lấy tất cả hóa đơn
    @Override
    public List<InvoiceResponseDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream()
            .map(invoiceMapper::toDTO)
            .toList();
    }

    // Lấy hóa đơn theo id của subscription
    @Override
    public InvoiceResponseDTO getInvoiceBySubscriptionId(Long subscriptionId) {
        Invoice invoice = invoiceRepository.findBySubscriptionId(subscriptionId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn"));
        return invoiceMapper.toDTO(invoice);
    }

    // Lấy hóa đơn theo id của người dùng
    @Override
    public List<InvoiceResponseDTO> getInvoicesByEmployerId(Long employerId) {
        return invoiceRepository.findBySubscription_Employer_Id(employerId).stream()
            .map(invoiceMapper::toDTO)
            .toList();
    }

    // Lấy hóa đơn theo trạng thái
    @Override
    public List<InvoiceResponseDTO> getInvoicesByStatus(String status) {
        InvoiceStatus invoiceStatus = InvoiceStatus.valueOf(status.toUpperCase());
        return invoiceRepository.findByStatus(invoiceStatus).stream()
            .map(invoiceMapper::toDTO)
            .toList();
    }

    // Hủy hóa đơn
    @Override
    public void cancelInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn"));
            
        if (invoice.getStatus() != InvoiceStatus.PENDING) {
            throw new InvalidOperationException("Chỉ có thể hủy hóa đơn đang chờ thanh toán");
        }

        invoice.setStatus(InvoiceStatus.CANCELLED);
        invoice.setNote("Hóa đơn bị hủy bởi người dùng");
        invoiceRepository.save(invoice);
    }
} 