package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Payment;
import com.codeforworks.NTH_WorkFinder.model.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Mapper(componentModel = "spring", imports = {Date.class, Calendar.class})
public interface SubscriptionMapper {



    @Mapping(source = "employer.id", target = "employerId")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(source = "packageEntity.packageName", target = "packageName")
    @Mapping(source = "packageEntity.id", target = "packageId")
    @Mapping(target = "startDate", source = "startDate", defaultExpression = "java(new Date())")
    @Mapping(target = "endDate", source = "subscription", qualifiedByName = "calculateEndDate")
    @Mapping(target = "paymentId", expression = "java(getFirstPaymentId(subscription.getPayments()))")
    @Mapping(target = "invoiceId", source = "invoice.id")
    SubscriptionResponseDTO toSubscriptionResponseDTO(Subscription subscription);

    @Named("calculateEndDate")
    default Date calculateEndDate(Subscription subscription) {
        if (subscription.getEndDate() != null) {
            return subscription.getEndDate();
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(subscription.getStartDate() != null ? 
            subscription.getStartDate() : new Date());
        calendar.add(Calendar.DAY_OF_MONTH, subscription.getPackageEntity().getDuration());
        return calendar.getTime();
    }

    default Long getFirstPaymentId(List<Payment> payments) {
        return payments.isEmpty() ? null : payments.get(0).getId();
    }
}