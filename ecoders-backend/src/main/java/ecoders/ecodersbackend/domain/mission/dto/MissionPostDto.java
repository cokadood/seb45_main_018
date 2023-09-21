package ecoders.ecodersbackend.domain.mission.dto;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;


public class MissionPostDto {

    @Getter
    public static class Request {

        private String text;
    }

    @Getter
    @AllArgsConstructor
    public static class Response {

        private final Long my_mission_id;
        private final String text;
        private final LocalDateTime createdAt;
        private final LocalDateTime modifiedAt;
        private final UUID memberId;
        private final boolean completed;

    }

}
