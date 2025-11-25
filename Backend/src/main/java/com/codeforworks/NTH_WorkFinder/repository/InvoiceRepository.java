package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Invoice;
import com.codeforworks.NTH_WorkFinder.model.Invoice.InvoiceStatus;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findBySubscription_Employer_Id(Long employerId);
    List<Invoice> findByStatus(InvoiceStatus status);
    Optional<Invoice> findBySubscriptionId(Long subscriptionId);
    List<Invoice> findAllBySubscriptionId(Long subscriptionId);
}
