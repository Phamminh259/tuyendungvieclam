package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.notification.NotificationResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "type", target = "type")
    @Mapping(source = "status", target = "status")
    NotificationResponseDTO toDTO(Notification notification);
} 