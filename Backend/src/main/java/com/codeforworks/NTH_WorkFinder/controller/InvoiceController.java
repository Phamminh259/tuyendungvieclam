package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.invoice.InvoiceResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final IInvoiceService invoiceService;

    // Lấy tất cả hóa đơn (ADMIN)
    @GetMapping
    public ResponseEntity<List<InvoiceResponseDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    // Lấy chi tiết hóa đơn (ADMIN + EMPLOYER)
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponseDTO> getInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    // Lấy hóa đơn theo subscription (ADMIN + EMPLOYER)
    @GetMapping("/subscription/{subscriptionId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceBySubscriptionId(@PathVariable Long subscriptionId) {
        return ResponseEntity.ok(invoiceService.getInvoiceBySubscriptionId(subscriptionId));
    }

    // Lấy hóa đơn theo employer (ADMIN + EMPLOYER)
    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByEmployer(@PathVariable Long employerId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByEmployerId(employerId));
    }

    // Lấy hóa đơn theo trạng thái (ADMIN)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(invoiceService.getInvoicesByStatus(status));
    }

    // Hủy hóa đơn (EMPLOYER)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelInvoice(@PathVariable Long id) {
        invoiceService.cancelInvoice(id);
        return ResponseEntity.ok().build();
    }
} 